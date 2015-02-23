'use strict';

let Util = use('Util'),
    ValidationException = use('Validation/Exceptions/ValidationException'),
    db = use('Models/index');

/**
 * Class TokenManager
 *
 * Manages API tokens
 */
class TokenManager
{
    /**
     * Construct an instance of a TokenManager
     *
     * @param Applications_ApplicationManager
     */
    constructor(Applications_ApplicationManager) {
        this.appManager = Applications_ApplicationManager;
    }

    /**
     * Create a new API token
     *
     * @param applicationId
     * @param days
     * @param comment
     * @returns {*}
     */
    create(applicationId, days, comment)
    {
        return this.appManager.find(applicationId)
            .then((application) => {
                // First, check that an application was found with the
                // provided ID
                if (application === null) {
                    throw new ValidationException(
                        ['Invalid application provided']
                    );
                }

                // Check that the days parameter is valid
                if (days < 0 || days > 30000) {
                    throw new ValidationException(
                        [
                            'Days parameter should within a valid range'
                            + ' (1-30000)'
                        ]
                    );
                }

                // Calculate expiration date
                let expirationDate = moment();
                expirationDate.add('days', req.body.days);

                // Begin creating the new token
                let newToken = db.ApplicationToken.build({
                    token: Util.randomToken(),
                    comment: req.body.comment,
                    ApplicationId: req.body.applicationId,
                    expiration_date: expirationDate.toDate()
                });

                // Validate token
                let validationErrors = Util.errorsToArray(newToken.validate());

                if (validationErrors.length > 0) {
                    throw new ValidationException(validationErrors);
                }

                return newToken.save();
            })
    }

    /**
     * Find a specific token by its ID
     *
     * @param tokenId
     * @returns {*}
     */
    find(tokenId)
    {
        return db.ApplicationToken.find(tokenId);
    }

    /**
     * Revoke a specific application token
     *
     * @param tokenId
     * @returns {*}
     */
    revoke(tokenId)
    {
        return db.ApplicationToken
            .find(tokenId)
            .then(function (token) {
                token.expiration_date = new Date();

                return token.save();
            });
    }
}

module.exports = TokenManager;
