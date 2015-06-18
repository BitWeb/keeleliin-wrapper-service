/**
 *  sudo npm install -g mocha
 */
var server = require('../../www/server');
var config = require('../../config');

var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('Routing', function() {
    var url = 'http://127.0.0.1:' + config.port;

    before(function(done) {
        server.startInstance( function(){
            done();
        });
    });

    describe('Service', function() {

        it('Tagastab api kirjelduse lehe', function(done) {

            request(url)
                .get('/')
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });

        it('Mitteeksisteeriv url tagastab json veateate', function(done) {

            request(url)
                .get('/midagisuvalist')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('errors');
                    done();
                });
        });

        it('Tagastab veateate, et sessiooni ei leitud', function(done) {

            var sessionId = 'suvaId';

            request(url)
                .get('/api/v1/service/' + sessionId)
                .expect(404)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('errors');
                    res.body.errors.session.should.equal('Sessiooni ei leitud');
                    done();
                })
        });

        it('Vastab sünkroonselt teenuse päringule', function(done){
            var body = {
                service: {
                    meta: {
                        isAsync: false
                    },
                    pipecontent: {
                        content: 'data'
                    }
                }
            };
            request(url)
                .post('/api/v1/service')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }

                    res.body.response.should.have.property('serviceId');
                    res.body.response.message.should.equal('OK');
                    res.body.response.should.have.property('pipecontent');
                    res.body.response.pipecontent.should.not.equal(undefined);
                    done();
                });
        });

        it('Annab pipecontenti contenti puudumise vea', function(done){
            var body = {
                service: {
                    meta: {
                        isAsync: false
                    },
                    pipecontent: {
                        //content: 'data'
                    }
                }
            };
            request(url)
                .post('/api/v1/service')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }

                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('pipecontent');
                    done();
                });
        });

        it('Vastab asünkroonselt', function(done){
            var body = {
                service: {
                    meta: {
                        isAsync: true
                    },
                    pipecontent: {
                        content: 'data'
                    }
                }
            };
            request(url)
                .post('/api/v1/service')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }

                    res.body.response.should.have.property('serviceId');
                    res.body.response.message.should.equal('RUNNING');
                    res.body.response.should.not.have.property('pipecontent');

                    var sessionId = res.body.response.serviceId;

                    setTimeout(function () {
                        request(url)
                            .get('/api/v1/service/' + sessionId)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .end(function(err, res) {
                                if (err) {
                                    throw err;
                                }
                                res.body.should.not.have.property('errors');
                                res.body.response.message.should.equal('OK');
                                res.body.response.should.have.property('pipecontent');
                                done();
                            });
                    }, 5000);

                });
        });
    });
});