// material-ui
import { Avatar, Box, Button, Card, CardContent, CardMedia, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// project imports
import parseApi from 'api/parseApi';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { useEffect } from 'react';
import useApi from 'hooks/useApi';
import TweetComponent from './../profile/TweetComponent';
import { useState } from 'react';

import topicBanner from 'assets/images/hashtag.jpeg';
import { useLocation, useParams } from 'react-router';

// ============================|| PROFILE PAGE ||============================ //
const TopicPage = () => {
    const { data: hashtag, loading: loadingHashtag, request: requestHashtag } = useApi(parseApi.getTopicByName);
    const { data: tweets, loading: loadingTweets, request: requestTweets } = useApi(parseApi.getTweetsFromHashtag);

    const location = useLocation();
    const topic = location.hash;

    useEffect(() => {
        requestHashtag(topic).then((tmpHashtag) => {
            requestTweets(tmpHashtag).then();
        });
    }, [location.pathname, topic]);

    return (
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={8} lg={6}>
                <Stack spacing={1} direction="column">
                    <Card
                        sx={{
                            backgroundColor: 'white',
                            height: { lg: 230 },
                            '& > *': {
                                flexGrow: 1,
                                flexBasis: '50%'
                            },
                            boxShadow: 2,
                            padding: 0
                        }}
                    >
                        <CardMedia component="img" height="140" src={topicBanner} alt="banner" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs="auto">
                                    <Typography variant="h2">Topics for {topic}</Typography>
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
export default TopicPage;
