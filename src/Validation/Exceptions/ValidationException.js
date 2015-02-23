'use strict';

/**
 * Class ValidationException
 *
 * Thrown when validations fail to pass
 */
class ValidationException extends Error
{
    /**
     * Build an instance of a ValidationException
     *
     * @param errors
     */
    constructor(errors)
    {
        super('Some validations failed');

        this.errors = errors;
    }

    /**
     * Get error messages
     *
     * @returns {array}
     */
    getMessages()
    {
        return this.errors;
    }
}

module.exports = ValidationException;
