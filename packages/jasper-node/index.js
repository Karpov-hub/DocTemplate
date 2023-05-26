let java = null,
  fs = require("fs"),
  path = require("path"),
  extend = require("extend"),
  util = require("util"),
  temp = require("temp"),
  async = require("async");

let defaults = { reports: {}, drivers: {}, conns: {}, tmpPath: "/tmp" };

function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.join(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

function jasper(options) {
  if (options.javaInstance) {
    java = options.javaInstance;
  } else {
    java = require("java");
  }
  java.asyncOptions = {
    asyncSuffix: undefined,
    syncSuffix: "",
    promiseSuffix: "Async",
    promisify: require("util").promisify
  };
  this.java = java;

  if (options.java) {
    if (util.isArray(options.java)) {
      options.java.forEach(function (javaOption) {
        java.options.push(javaOption);
      });
    }
    if (typeof options.java == "string") {
      java.options.push(options.java);
    }
  }
  var self = this;
  self.parentPath = path.dirname(module.parent.filename);
  var jrPath = path.resolve(self.parentPath, options.path || ".");
  async.auto(
    {
      jrJars: async function (cb) {
        if (
          fs.statSync(path.join(jrPath, "dist/lib")).isDirectory() &&
          fs.statSync(path.join(jrPath, "dist")).isDirectory()
        ) {
          async.parallel(
            [
              function (cb) {
                walk(path.join(jrPath, "dist"), function (err, results) {
                  cb(err, results);
                });
              },
              function (cb) {
                walk(path.join(jrPath, "dist/lib"), function (err, results) {
                  cb(err, results);
                });
              }
            ],
            function (err, results) {
              if (err) return cb(err);
              var r = results.shift();
              results.forEach(function (item) {
                r = r.concat(item);
              });
              cb(null, r);
            }
          );
        } else {
          walk(jrPath, function (err, results) {
            cb(err, results);
          });
        }
      },
      dirverJars: function (cb) {
        var results = [];
        if (options.drivers) {
          for (var i in options.drivers) {
            results.push(
              path.resolve(self.parentPath, options.drivers[i].path)
            );
          }
        }
        cb(null, results);
      },
      loadJars: [
        "jrJars",
        "dirverJars",
        function (cb, jars) {
          jars.jrJars.concat(jars.dirverJars).forEach(function (file) {
            if (path.extname(file) == ".jar") {
              java.classpath.push(file);
            }
          });
          cb();
        }
      ],
      debug: [
        "loadJars",
        function (cb) {
          if (!options.debug) options.debug = "off";
          var levels = [
            "ALL",
            "TRACE",
            "DEBUG",
            "INFO",
            "WARN",
            "ERROR",
            "FATAL",
            "OFF"
          ];
          if (levels.indexOf((options.debug + "").toUpperCase()) == -1)
            options.debug = "DEBUG";
          cb();
        }
      ],
      loadClass: [
        "loadJars",
        async function (cb) {
          let cl = await java.callStaticMethod(
            "java.lang.ClassLoader",
            "getSystemClassLoader"
          );
          for (let i in options.drivers) {
            await cl
              .loadClassAsync(await options.drivers[i].class)
              .newInstanceAsync();
          }
          cb();
        }
      ],
      imports: [
        "loadClass",
        function (cb) {
          self.dm = java.import("java.sql.DriverManager");
          self.jreds = java.import(
            "net.sf.jasperreports.engine.JREmptyDataSource"
          );
          self.jrjsonef = java.import(
            "net.sf.jasperreports.engine.data.JsonDataSource"
          );
          self.jbais = java.import("java.io.ByteArrayInputStream");
          self.jcm = java.import(
            "net.sf.jasperreports.engine.JasperCompileManager"
          );
          self.hm = java.import("java.util.HashMap");
          self.jfm = java.import(
            "net.sf.jasperreports.engine.JasperFillManager"
          );
          self.jem = java.import(
            "net.sf.jasperreports.engine.JasperExportManager"
          );
          self.formats = {
            Docx: "net.sf.jasperreports.engine.export.ooxml.JRDocxExporter",
            Pptx: "net.sf.jasperreports.engine.export.ooxml.JRPptxExporter",
            Xlsx: "net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter",
            Csv: "net.sf.jasperreports.engine.export.JRCsvExporter",
            Xml: "net.sf.jasperreports.engine.export.JRXmlExporter"
          };

          self.loc = java.import("java.util.Locale");

          cb();
        }
      ]
    },
    async function () {
      if (self.ready) {
        await self.ready();
      }
    }
  );

  delete options.path;
  extend(self, defaults, options);
}

jasper.prototype.ready = async function (f) {
  var self = this;
  self.ready = f;
};

jasper.prototype.add = function (name, def) {
  this.reports[name] = def;
};

jasper.prototype.pdf = async function (report) {
  return await this.export(report, "pdf");
};

let validConnections = {};
jasper.prototype.export = async function (report, type) {
  try {
    let self = this;

    if (!type) return;
    const fileExtension = type;
    type = type.charAt(0).toUpperCase() + type.toLowerCase().slice(1);

    let processReport = async function (report) {
      if (typeof report == "string") return [extend({}, self.reports[report])];
      if (util.isArray(report)) {
        let ret = [];
        for (let item of report) ret = ret.concat(await processReport(item));
        return ret;
      }
      if (typeof report == "function") return await processReport(report());

      if (typeof report == "object") {
        if (report.data || report.override) {
          let reps = await processReport(report.report);
          return reps.map((i) => {
            if (report.override) {
              extend(i, report.override);
            }
            i.data = report.data;
            i.dataset = report.dataset;
            i.query = report.query;
            return i;
          });
        }
        return [report];
      }
    };

    let processConn = async function (conn, item) {
      if (conn == "in_memory_json") {
        let byteArray = [];
        for (let bite of Buffer(JSON.stringify(item.dataset)))
          byteArray.push(bite);
        byteArray = java.newArray("byte", byteArray);
        return new self.jrjsonef(new self.jbais(byteArray), item.query || "");
      }
      if (typeof conn == "string") conn = self.conns[conn];
      if (typeof conn == "function") conn = conn();
      if (conn !== false && self.defaultConn)
        conn = self.conns[self.defaultConn];

      if (conn) {
        if (typeof conn.driver == "string")
          conn.driver = self.drivers[conn.driver];

        let connStr = conn.jdbc
          ? conn.jdbc
          : `jdbc:${conn.driver.type}://${conn.host}:${conn.port}/${conn.dbname}`;

        if (
          !validConnections[connStr] ||
          !validConnections[connStr].isValid(conn.validationTimeout || 1)
        )
          validConnections[connStr] = await self.dm.getConnectionAsync(
            connStr,
            conn.user,
            conn.pass
          );

        return validConnections[connStr];
      }
      return new self.jreds();
    };

    let parseLocale = async function (localeString) {
      let tokens = localeString.split(/[_|-]/);
      if (tokens.length > 1) return self.loc(tokens[0], tokens[1]);
      return self.loc(tokens[0]);
    };

    let reports = await processReport(report);
    let prints = [];
    for (let item of reports) {
      if (!item.jasper && item.jrxml)
        item.jasper = await self.compile(item.jrxml, self.tmpPath);

      if (item.jasper) {
        let data = null;
        if (item.data) {
          data = new self.hm();
          for (let objitem in item.data) {
            if (objitem === "REPORT_LOCALE") {
              item.data[objitem] = parseLocale(item.data[objitem]);
            }
            await data.putAsync(objitem, item.data[objitem]);
          }
        }
        let conn = await processConn(item.conn, item);
        let p = await self.jfm.fillReportAsync(
          path.resolve(self.parentPath, item.jasper),
          data,
          conn
        );
        prints.push(p);
      }
    }
    if (prints.length) {
      let master = prints.shift();
      for (let print of prints) {
        let s = print.getPages().size();
        for (let j = 0; j < s; j++) {
          master.addPage(print.getPages().get(j));
        }
      }
      let tempName = temp.path({ suffix: `.${fileExtension}` });
      if (type == "Pdf" || type == "Html")
        await self.jem["exportReportTo" + type + "FileAsync"](master, tempName);
      else {
        const Exporter = java.import(self.formats[type]);
        const SimpleExporterInput = java.import(
          "net.sf.jasperreports.export.SimpleExporterInput"
        );
        let exporter = new Exporter();
        await exporter.setExporterInputAsync(new SimpleExporterInput(master));
        if (type == "Csv") {
          const SimpleWriterExporterOutput = java.import(
            "net.sf.jasperreports.export.SimpleWriterExporterOutput"
          );
          await exporter.setExporterOutputAsync(
            new SimpleWriterExporterOutput(tempName)
          );
        } else if (type == "Xml") {
          const SimpleXmlExporterOutput = java.import(
            "net.sf.jasperreports.export.SimpleXmlExporterOutput"
          );
          await exporter.setExporterOutputAsync(
            new SimpleXmlExporterOutput(tempName)
          );
        } else {
          const SimpleOutputStreamExporterOutput = java.import(
            "net.sf.jasperreports.export.SimpleOutputStreamExporterOutput"
          );
          await exporter.setExporterOutputAsync(
            new SimpleOutputStreamExporterOutput(tempName)
          );
        }

        await exporter.exportReportAsync();
      }

      let exp = await readTemplate(tempName);
      return exp;
    }
    return "";
  } catch (ex) {
    throw ex;
  }
};
async function readTemplate(tempName) {
  return new Promise((resolve, reject) => {
    fs.readFile(tempName, (err, data) => {
      fs.unlink(tempName, (e) => {});
      return resolve(data);
    });
  });
}

jasper.prototype.compileAllAsync = async function (dstFolder) {
  var self = this;
  for (var name in self.reports) {
    var report = self.reports[name];
    if (report.jrxml) {
      report.jasper = await self.compile(
        report.jrxml,
        dstFolder || self.tmpPath
      );
    }
  }
};

jasper.prototype.compile = async function (jrxmlFile, dstFolder) {
  let self = this;
  let name = path.basename(jrxmlFile, ".jrxml");
  let file = path.join(dstFolder || self.tmpPath, name + ".jasper");
  await java.callStaticMethodAsync(
    "net.sf.jasperreports.engine.JasperCompileManager",
    "compileReportToFile",
    path.resolve(self.parentPath, jrxmlFile),
    file
  );
  return file;
};

jasper.prototype.toJsonDataSource = async function (dataset, query) {
  try {
    let self = this;
    let byteArray = [];
    for (let bite of Buffer(JSON.stringify(dataset))) byteArray.push(bite);
    byteArray = java.newArray("byte", byteArray);
    return new self.jrjsonef(new self.jbais(byteArray), query || "");
  } catch (ex) {
    throw ex;
  }
};

module.exports = function (options) {
  return new jasper(options);
};
