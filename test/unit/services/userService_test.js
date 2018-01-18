import * as Chai from 'chai';
import Sinon from 'sinon';
import * as UserClient from '../../../lib/clients/userClient';
import * as ClaimClient from '../../../lib/clients/claimClient';
import { getUserDetails, deleteUser } from '../../../lib/services/userService';
const Expect = Chai.expect;

describe('Unit::Service user service', () => {

    describe('When providing all users, it', () => {

        it('should return users with only the user info needed', () => {
            return result.then(users => {
                Expect(users[0].name).to.equal("Matt");
                Expect(users[1].name).to.equal("Marta");
                Expect(users[0].image).to.equal("mattsimage");
                Expect(users[1].image).to.equal("martasimage");
                Expect(users[0].id).to.equal("mattsid");
                Expect(users[1].id).to.equal("martasid");
                Expect(users[0].email).to.not.exist;
                Expect(users[1].email).to.not.exist;
                Expect(users[0].token).to.not.exist;
			    Expect(users[1].token).to.not.exist;
            })
        });

        let fetchUsers,
            sandbox = Sinon.sandbox.create(),
            result,
            promisedUsers = [
                {
                    name:"Matt",
                    image:'mattsimage',
                    id:'mattsid',
                    email:'matts@email.com',
                    token:'token'
                },
                {
                    name:"Marta",
                    image:"martasimage",
                    id:"martasid",
                    email:'marta@email.com',
                    token:'token'
                }
            ];

        beforeEach(() => {
		 	fetchUsers = sandbox.stub(UserClient, 'getUsers').returnsPromise();
		 	fetchUsers.resolves(promisedUsers);
			result = getUserDetails();
		});

		afterEach(() => {
		    sandbox.restore();
        });
    });

    const deletingUserFailureMessage = "failed to delete user",
	    serverErrorMessage = "Internal server error",
	    unauthorisedMessage = "401 unauthorised";

    describe('when deleting a user as and admin', () => {

        it('should request the user with the requesting users token', () => {
            Expect(fetchingUser).calledWith(authorizationToken);
        });

		it('should call the user client to delete', () => {
            Expect(deletingUser).calledWith(userIdToDelete);
        });

		it('should provide a success message stating the user had been delete', () => {
			return result.then(data => {
                Expect(data).to.equal(`${userIdToDelete} User was successfully deleted`);
            })
        });
        
        const userIdToDelete = 123,
            differentUserId = 321,
            authorizationToken = 'token';

        let deletingUser,
            userActioningDelete = {
                name:'matt',
                admin:true,
                _id:differentUserId
            },
            fetchingUser,
            sandbox = Sinon.sandbox.create(),
            result;

        beforeEach(() => {
            fetchingUser = sandbox.stub(ClaimClient, 'getUserByAuthorizationToken').returnsPromise();
            fetchingUser.resolves(userActioningDelete);
            deletingUser = sandbox.stub(UserClient, 'deleteUserById').returnsPromise();
            deletingUser.resolves(userIdToDelete);
            result = deleteUser(authorizationToken, userIdToDelete);
        });

        afterEach(() => {
            sandbox.restore();
        });
    });

    describe('when deleting a yourself', () => {

        it('should request the user with the requesting users token', () => {
            Expect(fetchingUser).calledWith(authorizationToken);
        });

		it('should call the user client to delete', () => {
            Expect(deletingUser).calledWith(userIdToDelete);
        });

		it('should provide a success message stating the user had been delete', () => {
			return result.then(data => {
                Expect(data).to.equal(`${userIdToDelete} User was successfully deleted`);
            })
        });
        
        const userIdToDelete = 123,
            differentUserId = 321,
            authorizationToken = 'token';

        let deletingUser,
            userActioningDelete = {
                name:'matt',
                admin:false,
                _id:userIdToDelete
            },
            fetchingUser,
            sandbox = Sinon.sandbox.create(),
            result;

        beforeEach(() => {
            fetchingUser = sandbox.stub(ClaimClient, 'getUserByAuthorizationToken').returnsPromise();
            fetchingUser.resolves(userActioningDelete);
            deletingUser = sandbox.stub(UserClient, 'deleteUserById').returnsPromise();
            deletingUser.resolves(userIdToDelete);
            result = deleteUser(authorizationToken, userIdToDelete);
        });

        afterEach(() => {
            sandbox.restore();
        });
    });

    describe('when do not have authorisation to delete a user,', () => {

        it('should request the user with the requesting users token', () => {
            Expect(fetchingUser).calledWith(authorizationToken);
        });

		it('should call the user client to delete', () => {
            Expect(deletingUser).not.calledWith(userIdToDelete);
        });

		it('should provide a success message stating the user had been delete', () => {
			return result.then(result => {
                
            }, (error) => {
                Expect(error.message).to.equal("Unauthorized");
                Expect(error.status).to.equal(401);
            })
        });
        
        const userIdToDelete = 123,
            differentUserId = 321,
            authorizationToken = 'token';

        let deletingUser,
            userActioningDelete = {
                name:'matt',
                admin:false,
                _id:differentUserId
            },
            fetchingUser,
            sandbox = Sinon.sandbox.create(),
            result;

        beforeEach(() => {
            fetchingUser = sandbox.stub(ClaimClient, 'getUserByAuthorizationToken').returnsPromise();
            fetchingUser.resolves(userActioningDelete);
            deletingUser = sandbox.stub(UserClient, 'deleteUserById').returnsPromise();
            result = deleteUser(authorizationToken, userIdToDelete);
        });

        afterEach(() => {
            sandbox.restore();
        });
    });
});