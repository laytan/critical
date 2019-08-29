const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'admin/dist/critical-admin.bundle': './src/admin/js/critical-admin.js',
        'public/dist/critical-public.bundle': './src/public/js/critical-public.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'src')
    }
};