//project imports
import * as React from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import parseApi from 'api/parseApi';
import { Form, FormikProvider, useFormik } from 'formik';
import useApi from 'hooks/useApi';
import { useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import useScriptRef from 'hooks/useScriptRef';
import * as Yup from 'yup';

// ============================|| EDIT PROFILE PAGE ||============================ //

const UserSchema = Yup.object().shape({
    fullName: Yup.string().min(3, 'Full name must be longer than 3 characters').max(40, 'Full name is too long'),
    bio: Yup.string().max(140, 'Your bio is too long'),
    website: Yup.string().url()
});

let file = null;
let banner = null;

const EditProfilePage = () => {
    const scriptedRef = useScriptRef();
    const { data: profile, loading: loadingProfile, request: requestProfile } = useApi(parseApi.getProfileByUserName);
    useEffect(() => {
        const username = parseApi.currentUser().get('username');
        requestProfile(username);
    }, []);

    const onSubmit = async (data, { setSubmitting, setStatus, setErrors }) => {
        try {
            if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                await parseApi.editProfile(profile, data);
                if (file) {
                    console.log('av');
                    await parseApi.changeUserAvatar(profile, file);
                }
                if (banner) {
                    console.log('ba');
                    await parseApi.changeUserBanner(profile, banner);
                }
            }
        } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
            }
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fullName: profile?.get('fullName') || '',
            website: profile?.get('website') || '',
            bio: profile?.get('bio') || 'Hey, I am a Tixter user !'
        },
        validationSchema: UserSchema,
        onSubmit: onSubmit
    });
    const { errors, values, touched, handleSubmit, isSubmitting, setValues, setFieldValue, getFieldProps, resetForm } = formik;

    return (
        <MainCard title="Edit Profile">
            <FormikProvider value={formik}>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                    <Stack direction="column" spacing={1.5}>
                        <Typography>Change your full name:</Typography>
                        <TextField
                            fullWidth
                            label="Full Name"
                            {...getFieldProps('fullName')}
                            error={Boolean(touched.fullName && errors.fullName)}
                            helperText={touched.fullName && errors.fullName}
                        ></TextField>
                        <Typography>Change your bio:</Typography>
                        <TextField
                            fullWidth
                            label="Biography"
                            {...getFieldProps('bio')}
                            error={Boolean(touched.bio && errors.bio)}
                            helperText={touched.bio && errors.bio}
                        ></TextField>
                        <Typography>Your website:</Typography>
                        <TextField
                            fullWidth
                            label="Website"
                            {...getFieldProps('website')}
                            error={Boolean(touched.website && errors.website)}
                            helperText={touched.website && errors.website}
                        ></TextField>
                        <Typography>Change your avatar:</Typography>
                        <Button variant="contained" color="secondary" size="large" component="label">
                            Upload Image
                            <input
                                hidden
                                accept="image/*"
                                multiple
                                type="file"
                                onChange={(event) => {
                                    file = event.currentTarget.files[0];
                                }}
                            />
                        </Button>
                        <Typography>Change your banner:</Typography>
                        <Button variant="contained" color="secondary" size="large" component="label">
                            Upload Image
                            <input
                                hidden
                                accept="image/*"
                                multiple
                                type="file"
                                onChange={(event) => {
                                    banner = event.currentTarget.files[0];
                                }}
                            />
                        </Button>
                    </Stack>
                    <Stack paddingTop={2}>
                        <Button variant="contained" size="large" type="submit">
                            Save changes
                        </Button>
                    </Stack>
                </Form>
            </FormikProvider>
        </MainCard>
    );
};

export default EditProfilePage;
