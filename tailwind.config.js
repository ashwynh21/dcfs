module.exports = (isProd) => ({
    prefix: 'tw-',
    future: {
      removeDeprecatedGapUtilities: true,
      purgeLayersByDefault: true
    },
    purge: {
      enabled: isProd,
      content: ['**/*.html', '**/*.ts']
    },
    theme: {}
});
