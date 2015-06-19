/**
 * Created by priit on 18.06.15.
 */

var FileUtil = require('../../../src/util/file');
var config = require('../../../config');
var should = require('should');
var assert = require('assert');
var fs = require('fs');

describe('File util', function() {

    var tmpPath = config.service.staticOptions.tmpPath;
    var mvSource = tmpPath + 'mvSource';
    var mvTarget = tmpPath + 'mvTarget';

    before(function(done) {
        done();
    });

    it('Faili liigutamine', function(done) {

        //loo fail
        fs.writeFileSync(mvSource, 'Faili sisu');

        fs.unlink(mvTarget, function () {
            should(fs.existsSync(mvSource)).be.ok();
            should(fs.existsSync(mvTarget)).not.be.ok();

            FileUtil.mv(mvSource, mvTarget, function(){
                should(fs.existsSync(mvSource)).not.be.ok();
                should(fs.existsSync(mvTarget)).be.ok();

                fs.unlink(mvTarget, function () {
                    done();
                });
            });
        });
    });

    it('Olematu Faili kopeerimine', function(done) {

        fs.unlink(mvTarget, function () {
            should(fs.existsSync(mvSource)).not.be.ok();
            should(fs.existsSync(mvTarget)).not.be.ok();

            FileUtil.cp(mvSource, mvTarget, function(){
                should(fs.existsSync(mvSource)).not.be.ok();
                should(fs.existsSync(mvTarget)).be.ok();

                fs.unlink(mvTarget, function () {
                    done();
                });
            });
        });
    });

});