export default function (kibana) {

  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'transform_vis',
    uiExports: {
      visTypes: [
        'plugins/transform_vis/transform_vis'
      ],
      injectDefaultVars(server, options) {
        return {
          transformVisOptions: options
        };
      }
    },
    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        allow_unsafe: Joi.boolean().default(false)
      }).default();
    },
  });
}
