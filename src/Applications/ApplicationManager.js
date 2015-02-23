'use strict';

let db = use('Models/index');

/**
 * Class ApplicationManager
 *
 * Find specific applications
 */
class ApplicationManager
{
    /**
     * Finds a specific application
     *
     * @param applicationId
     * @returns {*}
     */
    find(applicationId)
    {
        return db.Application.find(Number(applicationId));
    }

    /**
     * Check whether an application exists or not
     *
     * @param applicationId
     * @returns {*}
     */
    exists(applicationId)
    {
        return this.exists(applicationId)
            .then((application) => {
                return (application !== null)
            });
    }
}

module.exports = ApplicationManager;
