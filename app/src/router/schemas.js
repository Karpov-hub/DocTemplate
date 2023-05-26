module.exports = {
  jasperService: {
    saveTemplate: {
      type: "object",
      properties: {
        id: { type: "string" },
        report_name_for_user: { type: "string" },
        report_name_in_system: { type: "string" },
        code: { type: "string" },
        ctime: { type: "string" },
        file: { type: "object" },
        files_list: { type: "array" },
        images_codes: { type: "string" }
      },
      required: ["id", "report_name_for_user", "report_name_in_system"]
    },
    getReport: {
      type: "object",
      properties: {
        report_name: { type: "string" },
        report_data: { type: "object" },
        report_format: { type: "string" }
      },
      required: ["report_name", "report_data"]
    },
    getReportInBase64: {
      type: "object",
      properties: {
        report_name: { type: "string" },
        report_data: { type: "object" },
        report_format: { type: "string" }
      },
      required: ["report_name", "report_data"]
    },
    getReportTemplates: {
      type: "object",
      properties: {
        filter: { type: "string" },
        fields: { type: "array" },
        start: { type: ["integer", "string"] },
        limit: { type: ["integer", "string"] },
        sort: { type: "string" }
      }
    },
    removeTemplate: {
      type: "object",
      properties: {
        id: { type: "string" }
      },
      required: ["id"]
    }
  },
  auth: {
    signin: {
      type: "object",
      properties: {
        login: { type: "string" },
        password: { type: "string" }
      },
      required: ["login", "password"]
    },
    getUserData: {
      type: "object",
      properties: {
        token: { type: "string" }
      },
      required: ["token"]
    },
    refreshToken: {
      type: "object",
      properties: {
        token: { type: "string" }
      },
      required: ["token"]
    },
    logout: {
      type: "object",
      properties: {
        token: { type: "string" }
      },
      required: ["token"]
    }
  },
  user: {
    getPermissions: {
      type: "object",
      properties: {
        filter: { type: "object" },
        fields: { type: "array" },
        start: { type: ["integer", "string"] },
        limit: { type: ["integer", "string"] },
        order: { type: "object" }
      }
    },
    updatePermissions: {
      type: "object",
      properties: {
        id: { type: "string" },
        ctime: { type: "string" },
        name: { type: "string" },
        permissions_array: { type: "array" }
      },
      required: ["name", "ctime"]
    },
    removePermission: {
      type: "object",
      properties: {
        id: { type: "string" }
      },
      required: ["id"]
    },

    getUsers: {
      type: "object",
      properties: {
        filter: { type: "object" },
        fields: { type: "array" },
        start: { type: ["integer", "string"] },
        limit: { type: ["integer", "string"] },
        order: { type: "object" }
      }
    },
    updateUsers: {
      type: "object",
      properties: {
        id: { type: "string" },
        role: { type: "string" },
        name: { type: "string" },
        login: { type: "string" },
        password: { type: "string" },
        ctime: { type: "string" },
        block: { type: "string" }
      },
      required: ["role", "name", "login", "password", "ctime"]
    },
    removeUser: {
      type: "object",
      properties: {
        id: { type: "string" }
      },
      required: ["id"]
    },
    blockUser: {
      type: "object",
      properties: {
        id: { type: "string" },
        action: { type: "string" }
      },
      required: ["id", "action"]
    }
  },
  document: {
    getInnerDocuments: {
      type: "object",
      properties: {
        filter: { type: "object" },
        fields: { type: "array" },
        start: { type: ["integer", "string"] },
        limit: { type: ["integer", "string"] },
        order: { type: "object" }
      }
    },
    updateInnerDocuments: {
      type: "object",
      properties: {
        id: { type: "string" },
        template: { type: "string" },
        name: { type: "string" },
        system_name: { type: "string" },
        code: { type: "string" },
        type: { type: "string" },
        data_example: { type: "string" },
        ctime: { type: "string" },
        file: { type: "object" }
      },
      required: ["name", "system_name", "type", "data_example"]
    }
  },
  settings: {
    checkUniqueSystemReportName: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" }
      },
      required: ["id", "name"]
    }
  },
  client: {
    auth: {
      signup_personal: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", maxLength: 40 },
          password: { type: "string", maxLength: 50 },
          first_name: { type: "string", maxLength: 30 },
          last_name: { type: "string", maxLength: 30 },
          middle_name: { type: ["string", "null"], maxLength: 30 },
          phone: { type: "string", maxLength: 20 },
          captcha: { type: "string" }
        },
        required: [
          "email",
          "password",
          "first_name",
          "last_name",
          "captcha",
          "password"
        ]
      },
      signup_business: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", maxLength: 40 },
          password: { type: "string", maxLength: 50 },
          phone: { type: "string", maxLength: 20 },
          company_name: { type: "string", maxLength: 255 },
          company_director_fullname: { type: "string", maxLength: 255 },
          captcha: { type: "string" }
        },
        required: [
          "email",
          "password",
          "company_name",
          "company_director_fullname",
          "captcha"
        ]
      },
      signin: {
        type: "object",
        properties: {
          email: { type: "string", maxLength: 40 },
          password: { type: "string", maxLength: 50 },
          captcha: { type: "string" }
        },
        required: ["email", "password", "captcha"]
      },
      "activate-profile": {
        type: "object",
        properties: {
          activation_token: { type: "string" }
        },
        required: ["activation_token"]
      },
      "password-restore": {
        type: "object",
        properties: {
          email: { type: "string" },
          captcha: { type: "string" }
        },
        required: ["email", "captcha"]
      },
      "password-restore-submit": {
        type: "object",
        properties: {
          email: { type: "string" },
          token: { type: "string" },
          password: { type: "string" },
          captcha: { type: "string" }
        },
        required: ["email", "token", "password", "captcha"]
      },
      "resend-otp": {
        type: "object",
        properties: {
          otp_token: { type: "string" }
        },
        required: ["otp_token"]
      },
      "check-otp": {
        type: "object",
        properties: {
          otp_token: { type: "string" },
          otp: { type: "string" }
        },
        required: ["otp_token"]
      },
      cleanTest: {
        type: "object",
        properties: {
          email: { type: "string", maxLength: 40 }
        },
        required: ["email"]
      }
    },
    profile: {
      "get-clients": {
        type: "object",
        properties: {
          id: { type: "string" },
          start: { type: ["integer", "string"] },
          limit: { type: ["integer", "string"] },
          div: { type: "string" },
          field: { type: "string" }
        }
      },
      "update-blocking-client": {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      },
      "update-client": {
        type: "object",
        properties: {
          session_token: { type: "string" },
          email: { type: "string", maxLength: 40 },
          first_name: { type: "string", maxLength: 30 },
          last_name: { type: "string", maxLength: 30 },
          middle_name: { type: "string", maxLength: 30 },
          phone: { type: "string", maxLength: 12 }
        },
        required: ["session_token"]
      },
      "update-client-password": {
        type: "object",
        properties: {
          session_token: { type: "string" },
          password: { type: "string", maxLength: 50 }
        },
        required: ["session_token", "password"]
      },
      "delete-client": {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      }
    }
  },
  order: {
    "create-order": {
      type: "object",
      properties: {
        session_token: { type: "string" },
        template_name: { type: "string", maxLength: 50 },
        requirements: { type: "string" },
        type: { type: "integer" },
        attached_files: { type: "array" }
      },
      required: ["session_token", "template_name", "requirements", "type"]
    },
    "get-order": {
      type: "object",
      properties: {
        operator_id: { type: "string" },
        start: { type: ["integer", "string"] },
        limit: { type: ["integer", "string"] },
        div: { type: "string" },
        field: { type: "string" }
      }
    },
    "apply-order-to-operator": {
      type: "object",
      properties: {
        session_token: { type: "string" },
        order_id: { type: "string" }
      },
      required: ["session_token", "order_id"]
    },
    "change-order-status": {
      type: "object",
      properties: {
        status: { type: "integer" },
        note: { type: "string" },
        order_id: { type: "string" }
      },
      required: ["status", "order_id"]
    },
    "complete-order": {
      type: "object",
      properties: {
        order_id: { type: "string" },
        category_id: { type: "string" },

        report_name_for_user: { type: "string" },
        report_name_in_system: { type: "string" },

        code: { type: "string" },
        file: { type: "object" },
        files_list: { type: "array" },
        images_codes: { type: "string" }
      },
      required: [
        "report_name_for_user",
        "report_name_in_system",
        "order_id",
        "category_id"
      ]
    }
  },
  category: {
    "create-category": {
      type: "object",
      properties: {
        name: { type: "object" },
        description: { type: "object" },
        filterTable: { type: "string", format: "integer", minimum: 0, maximum: 2 }
      },
      required: ["name", "description", "filterTable"]
    },
    "update-category": {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "object" },
        description: { type: "object" },
        filterTable: { type: "string", format: "integer", minimum: 0, maximum: 2 }
      },
      required: ["id", "filterTable"]
    },
    "delete-category": {
      type: "object",
      properties: {
        id: { type: "string" },
        filterTable: { type: "string", format: "integer", minimum: 0, maximum: 2 }
      },
      required: ["id", "filterTable"]
    },
    "bindto-category": {
      type: "object",
      properties: {
        category_id: { type: "string" },
        template_id: { type: "string" },
        filterTable: { type: "string", format: "integer", minimum: 0, maximum: 2 }
      },
      required: ["category_id", "template_id", "filterTable"]
    },
    "get-categories": {
      type: "object",
      properties: {
        id: { type: "string" },
        start: { type: ["integer", "string"] },
        limit: { type: ["integer", "string"] },
        div: { type: "string" },
        field: { type: "string" },
        name: { type: "string" },
        filterTable: { type: "string", format: "integer", minimum: 0, maximum: 2 }
      },
      required: ["filterTable"]
    },
    "get-templates": {
      type: "object",
      properties: {
        category_id: { type: "string" },
        client_id: { type: "string" },
        token: { type: "string" }
      },
      required: ["category_id"]
    }
  }
};
