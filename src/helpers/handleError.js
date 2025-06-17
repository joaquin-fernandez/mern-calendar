export const getErrorList = ({ response }) => {
    const { errors, msg } = response.data;

    const errorsList = errors
        ? Object.values(errors).map(({ msg }) => ({ error: msg }))
        : [{ msg: msg }];

    return errorsList;
};
