import PropTypes from 'prop-types';

// icon import
import { IconMapPin, IconCalendarEvent, IconLink } from '@tabler/icons';

// material-ui
import { Avatar, Box, Button, Card, CardContent, CardMedia, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// project imports
import parseApi from 'api/parseApi';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { useLocation, useParams } from 'react-router';
import { useEffect } from 'react';
import useApi from 'hooks/useApi';
import TweetComponent from './TweetComponent';
import { useState } from 'react';

import verified from 'assets/images/verified.png';

const icons = { IconMapPin };

// ============================|| PROFILE PAGE ||============================ //
const UserProfilePage = () => {
    const location = useLocation();
    const { data: following, loading: loadingFollowing, request: requestFollowing } = useApi(parseApi.getFollowingFromProfile);
    const { data: follower, loading: loadingFollower, request: requestFollower } = useApi(parseApi.getFollowersFromProfile);
    const { data: profile, loading: loadingProfile, request: requestProfile } = useApi(parseApi.getProfileByUserName);
    const { data: tweets, loading: loadingTweets, request: requestTweets } = useApi(parseApi.getTweets);

    let myProfile = false;

    const [followed, setFollow] = useState(false);

    const onFollow = (targetProfile) => {
        setFollow(true);
        console.log('follow');
        parseApi.follow(targetProfile.id);
    };

    const onUnfollow = (targetProfile) => {
        setFollow(false);
        console.log('unfollow');
        parseApi.unfollow(targetProfile.id);
    };

    let { username } = useParams();
    const myUsername = parseApi.currentUser().get('username');
    if (!username || username === myUsername) {
        username = myUsername;
        myProfile = true;
    }
    useEffect(() => {
        requestProfile(username).then((tmpProfile) => {
            requestFollowing(tmpProfile).then();
            requestFollower(tmpProfile).then((tmpFollowers) => {
                tmpFollowers?.find((f) => f.id === parseApi.currentUser().get('publicProfile').id) ? setFollow(true) : setFollow(false);
            });
            requestTweets(tmpProfile).then();
        });
    }, [location.pathname]);

    return (
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={8} lg={6}>
                <Stack spacing={1} direction="column">
                    <Card
                        sx={{
                            backgroundColor: 'white',
                            height: { lg: 410 },
                            '& > *': {
                                flexGrow: 1,
                                flexBasis: '50%'
                            },
                            boxShadow: 2,
                            padding: 0
                        }}
                    >
                        <CardMedia component="img" height="140" src={profile?.get('bannerUrl') || ''} alt="banner" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs="auto">
                                    <Stack direction="row">
                                        <Avatar
                                            src={profile?.get('avatarUrl') || ''}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                marginTop: -8,
                                                borderRadius: 9999,
                                                borderStyle: 'solid',
                                                border: 3,
                                                color: 'white'
                                            }}
                                        ></Avatar>
                                        {!myProfile && (
                                            <Button
                                                onClick={() => {
                                                    if (!followed) onFollow(profile);
                                                    else onUnfollow(profile);
                                                }}
                                                variant="contained"
                                                color={followed ? 'error' : 'primary'}
                                                sx={{ width: 100, height: 40, marginLeft: 50 }}
                                            >
                                                {followed ? 'Unfollow' : 'Follow'}
                                            </Button>
                                        )}
                                    </Stack>
                                    <Stack spacing={1} paddingTop={2}>
                                        <Stack direction="row">
                                            <Typography variant="h3">{profile?.get('fullName')}</Typography>
                                            {profile?.get('certified') ? <img src={verified} alt="verified" width="25" height="25" /> : ''}
                                        </Stack>
                                        <Typography variant="h5">@{profile?.get('userName')}</Typography>
                                    </Stack>

                                    <Stack paddingTop={2}>
                                        <Typography variant="h4" fontWeight={200}>
                                            {profile?.get('bio') || 'Hey, I am a Tixter user !'}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} paddingTop={2}>
                                        <Stack direction="row">
                                            <IconMapPin size={17} />
                                            <Typography paddingLeft={0.5} variant="h6" fontWeight={200}>
                                                {profile?.get('latestGeolocation') || 'In Tixter world'}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row">
                                            <IconCalendarEvent size={17} />
                                            <Typography
                                                paddingLeft={0.5}
                                                variant="h6"
                                                fontWeight={200}
                                                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            >
                                                Has joined Tixter {profile?.get('createdAt').toString().split(' ').slice(0, 4).join(' ')}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row">
                                            {profile?.get('website') ? <IconLink size={17} /> : console.log('no website')}
                                            <a href={profile?.get('website') || ''} variant="h6" fontWeight={200}>
                                                {profile?.get('website') || ''}
                                            </a>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} paddingTop={2}>
                                        <Stack direction="row">
                                            <Typography variant="h5"> {following?.length} </Typography>
                                            <Typography variant="h6" fontWeight={200} paddingLeft={0.5}>
                                                followings
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row">
                                            <Typography variant="h5"> {follower?.length} </Typography>
                                            <Typography variant="h6" fontWeight={200} paddingLeft={0.5}>
                                                followers
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {tweets?.map((tweet, index) => (
                        <TweetComponent tweet={tweet} key={index} />
                    ))}
                </Stack>
            </Grid>
        </Grid>
    );
};
export default UserProfilePage;
