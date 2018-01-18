import Sinon from 'sinon';
import * as Chai from 'chai';
const Expect = Chai.expect;

import { jsonError } from '../../../../lib/middleware/responseBuilders/jsonError';
import * as ErrorLogClient from '../../../../lib/clients/errorLogClient';

describe('Unit::Middleware json error response ', () => {

	describe('when providing an json error response and the error status is 500', () => {

        it('it should request the error be logged passing the error to the error log client', () => {
            Expect(LoggingError).calledWith(error);
        });

        it('it should set the success property on the response to false', () =>{
            Expect(res.body.success).to.equal(false);
        });

        it('it should set the message property on the response to the error message', () =>{
            Expect(res.body.message).to.equal(error.message);
        });
    
        const error = {
            message:"Error message",
            status:500
        },
        errorLog = {
            message:"Error message",
            status:500,
            _id:123
        }

        let sandbox = Sinon.sandbox.create(),
            res = { 
                json:(obj) => { res.body = obj },
                status:function(status) {
                    res.statusValue = status;
                    return this;
                }
            },
            result,
            LoggingError;

        beforeEach(() => {
            LoggingError = sandbox.stub(ErrorLogClient, 'logError').returnsPromise();
            LoggingError.resolves(errorLog);
            result = jsonError(error, res);
        });

        afterEach(() => {
            sandbox.restore();
        });
    });

    describe('when providing an json error response and the error status is not found', () => {

        it('it should request the error be logged passing the error to the error log client', () => {
            Expect(LoggingError).calledWith(error);
        });

        it('it should set the success property on the response to false', () =>{
            Expect(res.body.success).to.equal(false);
        });
        
        it('it should set the message property on the response to the error message', () =>{
            Expect(res.body.message).to.equal(error.message);
        });
    
        const error = {
            message:"Error message",
        },
        errorLog = {
            message:"Error message",
            _id:123
        }

        let sandbox = Sinon.sandbox.create(),
            res = { 
                json:(obj) => { res.body = obj },
                status:function(status) {
                    res.statusValue = status;
                    return this;
                }
            },
            result,
            LoggingError;

        beforeEach(() => {
            LoggingError = sandbox.stub(ErrorLogClient, 'logError').returnsPromise();
            LoggingError.resolves(errorLog);
            result = jsonError(error, res);
        });

        afterEach(() => {
            sandbox.restore();
        });
    });


    describe('when providing an json error response and the error status is not 500 but is present', () => {

        it('it should not request the error be logged', () => {
            Expect(LoggingError).not.calledWith(error);
        });

        it('it should set the success property on the response to false', () =>{
            Expect(res.body.success).to.equal(false);
        });
        it('it should set the message property on the response to the error message', () =>{
            Expect(res.body.message).to.equal(error.message);
        });
    
        const error = {
            message:"Error message",
            status:401
        };

        let sandbox = Sinon.sandbox.create(),
            res = { 
                json:(obj) => { res.body = obj },
                status:function(status) {
                    res.statusValue = status;
                    return this;
                }
            },
            result,
            LoggingError;

        beforeEach(() => {
            LoggingError = sandbox.stub(ErrorLogClient, 'logError').returnsPromise();
            result = jsonError(error, res);
        });

        afterEach(() => {
            sandbox.restore();
        });

    });

});