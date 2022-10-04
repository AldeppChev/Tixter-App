import { IconHeart, IconMessageCircle2, IconRepeat } from '@tabler/icons';
import Lottie, { LottiePlayer } from 'lottie-react';
import heartAnimation from 'assets/animations/heart-lottie-animation.json';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Grid, IconButton, Stack, Typography } from '@mui/material';
import parseApi from 'api/parseApi';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useApi from 'hooks/useApi';
import { useLocation, useNavigate, useParams } from 'react-router';

// ================================= TWEET COMPONENT ==================================== //

function TweetComponent({ tweet }) {
    const navigate = useNavigate();
    const { username } = useParams();
    const [liked, setLiked] = useState(false);
    const profile = tweet.get('poster');
    const { data: profileData, loading: loadingProfile, request: requestProfile } = useApi(parseApi.getProfileByID);
    const { data: likes, loading: loadingLikes, request: requestLikes } = useApi(parseApi.getLikesFromTweet);
    /**
     * @type {import('lottie-react').LottieOptions}
     */

    const toggleLike = () => {
        setLiked(!liked);
        parseApi.toggleLike(liked, tweet.id);
    };
    useEffect(() => {
        requestProfile(profile.id).then();
        requestLikes(tweet).then((tmpLikes) => {
            tmpLikes?.find((f) => f.id === parseApi.currentUser().get('publicProfile').id) ? setLiked(true) : setLiked(false);
        });
    }, [username, tweet.id]);
    return (
        <Card
            sx={{
                '& > *': {
                    flexGrow: 1,
                    flexBasis: '50%'
                },
                boxShadow: 2
            }}
        >
            <CardContent>
                <Grid container spacing={3} width={900}>
                    <Grid item xs="auto">
                        <Stack direction="row">
                            <Avatar
                                onClick={() => navigate('/profile/' + profileData?.get('userName'))}
                                sx={{ width: 50, height: 50, boxShadow: 1 }}
                                src={profileData?.get('avatarUrl') || ''}
                            />
                            <Stack paddingLeft={2} direction="column">
                                <Stack direction="row">
                                    <Typography variant="h5" fontWeight={700} maxWidth={450}>
                                        {profileData?.get('fullName')}
                                    </Typography>
                                    <Typography paddingLeft={0.5} variant="h5" color="gray" fontWeight={200} maxWidth={450}>
                                        @{profileData?.get('userName')} · {dayjs(tweet.get('createdAt')).format('DD MMM YYYY HH:mm')}
                                    </Typography>
                                </Stack>
                                <Typography variant="h5" sx={{ wordWrap: 'break-word' }} fontWeight={200} maxWidth={400}>
                                    {tweet.get('body')}
                                </Typography>
                                <Stack direction="row" paddingTop={1} spacing={10}>
                                    <IconButton>
                                        <IconMessageCircle2 size={20} />
                                    </IconButton>
                                    <IconButton>
                                        <IconRepeat size={20} />
                                    </IconButton>
                                    <Stack direction="row">
                                        <IconButton onClick={() => toggleLike()}>
                                            {!liked && <IconHeart size={20} />}
                                            {liked && <IconHeart size={20} color="red" fill="red" />}
                                        </IconButton>
                                        <Typography paddingTop={1.5} paddingLeft={0.5}>
                                            {likes?.length}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default TweetComponent;
