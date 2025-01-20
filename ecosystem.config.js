require('dotenv').config();

module.exports = {
    apps: [
      {
        name: "crm-ivi-front",
        script: "npm",
        args: `start -- -p ${process.env.PORT || 3000}`,
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };