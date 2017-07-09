import Axios from 'axios';
import * as Chai from 'chai';
import Sinon from 'sinon';
import * as FacebookClient from '../../../clients/facebookClient';

const Expect = Chai.expect;

describe('Unit::facebookClient', () => {

	describe('When getting user via access token', () => {

		it('it should request to facebook for the user using the access token and facebook url and parameters', () => {
			Expect(gettingFacebookUser).calledWith(`${facebookGraphUri}?access_token=${accessToken}&fields=${parameters}`);
		});

		it('it should return the facebook user', () => {
			return result.then((user) => {
				Expect(user).to.equal(facebookUser);
			})
		});

		const accessToken = 'token',
			facebookGraphUri = "https://graph.facebook.com/me",
			parameters = "email,name,picture",
			facebookUser = {
				'name':'matt',
				'email':'matt@email.com',
				'picture':
					{ 
						data: {
							url:"image.src"
						}
					}
			};

			let gettingFacebookUser,
				result,
				sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			
			gettingFacebookUser = sandbox.stub(Axios, 'get').returnsPromise();
			gettingFacebookUser.resolves(facebookUser);
			result = FacebookClient.getFacebookUser(accessToken);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});

});