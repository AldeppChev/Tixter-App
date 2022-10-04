import * as React from 'react';
import { Button, List, Stack, Typography, Box, useTheme, TextField, Grid, Divider } from '@mui/material';
import parseApi from 'api/parseApi';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import useScriptRef from 'hooks/useScriptRef';
import { useEffect } from 'react';
import useApi from 'hooks/useApi';
import TweetComponent from 'views/profile/TweetComponent';

// ============================= TWEET ================================= //

const UserSchema = Yup.object().shape({
    tweet: Yup.string().min(1, 'Empty tweet').max(140, 'Tweet is too long')
});

const handleChange = (event) => {
    setValue(event.target.value);
};

let following = null;

export default function Tweet() {
    const { data: profile, loading: loadingProfile, request: requestProfile } = useApi(parseApi.getProfileByUserName);
    const { data: tweets, loading: loadingTweets, request: requestTweets } = useApi(parseApi.getTweetsFromFollowings);
    const { data: followings, loading: loadingFollowing, request: requestFollowings } = useApi(parseApi.getFollowingFromProfile);

    const myUsername = parseApi.currentUser().get('username');
    useEffect(() => {
        requestProfile(myUsername).then((tmpProfile) => {
            requestFollowings(tmpProfile).then((tmpFollowings) => {
                requestTweets(tmpFollowings).then((tmpTweets) => {
                    console.log(tmpTweets);
                });
            });
        });
    }, [myUsername]);
    const scriptedRef = useScriptRef();
    const onSubmit = async (data, { setSubmitting, setStatus, setErrors, resetForm }) => {
        try {
            if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
                const tweetId = await parseApi.postTweet(data.tweet);
                console.log('Tweet body : ' + data.tweet);
                console.log(tweetId);
                resetForm();
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
            tweet: ''
        },
        validationSchema: UserSchema,
        onSubmit: onSubmit
    });
    const { errors, values, touched, handleSubmit, isSubmitting, setValues, setFieldValue, getFieldProps } = formik;

    return (
        <Grid container justifyContent="center">
            <FormikProvider value={formik}>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            '& .MuiTextField-root': { m: 2, width: '120ch' }
                        }}
                        paddingTop={2}
                    >
                        <TextField
                            id="filled-multiline-static"
                            label="What's up ?"
                            {...getFieldProps('tweet')}
                            multiline
                            rows={4}
                            variant="filled"
                        />
                    </Box>
                    <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
                        <Button size="large" variant="contained" color="primary" type="submit">
                            Tixter
                        </Button>
                    </Grid>
                </Form>
            </FormikProvider>
            <Grid paddingTop={2} container justifyContent="center">
                <Stack direction="column" spacing={1}>
                    {
                        //console.log(tweetList)}
                    }
                    {tweets?.map((tweet, index) => (
                        <TweetComponent tweet={tweet} key={index} />
                    ))}
                </Stack>
            </Grid>
        </Grid>
    );
}
