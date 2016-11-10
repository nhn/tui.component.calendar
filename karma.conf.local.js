module.exports = function(config) {
    config.set({
        basePath: './',

        frameworks: ['browserify', 'jasmine'],

        reporters: [
            'dots',
            'coverage',
            'junit'
        ],

        files: [
            'bower_components/jquery/jquery.min.js',
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
            'bower_components/tui-code-snippet/code-snippet.js',
            'src/js/*.js',
            'test/*.spec.js',
            {
                pattern: 'test/fixture/**/*.html',
                included: false
            },
            {
                pattern: 'test/css/**/*.css',
                included: false
            }
        ],

        exclude: [],

        preprocessors: {
            'src/**/*.js': ['browserify', 'coverage'],
            'test/**/*.js': ['browserify']
        },

        coverageReporter: {
            dir: 'report/coverage/',
            reporters: [
                {
                    type: 'html',
                    subdir: function(browser) {
                        return 'report-html/' + browser;
                    }
                },
                {
                    type: 'cobertura',
                    subdir: function(browser) {
                        return 'report-cobertura/' + browser;
                    },
                    file: 'cobertura.txt'
                }
            ]
        },

        junitReporter: {
            outputDir: 'report',
            outputFile: 'report/junit-result.xml',
            suite: ''
        },

        browserify: {
            debug: true
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: [
            'Chrome'
        ],

        singleRun: false
    });
};
