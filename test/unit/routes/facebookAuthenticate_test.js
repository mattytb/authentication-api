import * as Chai from 'chai';
import Sinon from 'sinon';
//import * as facebookClient from '../../../clients/facebookClient';

const Expect = Chai.expect;

describe('Unit::Route facebookAuthenticate', () => {

	let sandbox = Sinon.sandbox.create(),
	res = { 
		json:(obj) => { res.body = obj },
		status:function(status) {
			res.statusValue = status;
        	return this;
    	}
    };
	
	describe('When authenticating a facebook user', () => {

		it('should request a facebook user using the access token provided', () => {
			//Expect(fetchingFacebookUser).calledWith(req.body.accessToken)
		})

		const req = {
			body:{
				accessToken: 'facebookaccesstoken'
			}
		};

	});
});