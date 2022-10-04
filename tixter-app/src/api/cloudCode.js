import Parse from 'parse';

/**
 *
 * @param {Parse.Object} original
 * @param {Parse.Object} changed
 * @return {String}
 */

/**
 * @typedef UserProfile
 * @property {String} objectId
 * @property {Date} updatedAt
 * @property {Date} createdAt
 * @property {Parse.ACL} ACL
 * @property {String} fullName
 * @property {String} avatarUrl
 * @property {String} bannerUrl
 * @property {String} userName
 * @property {String} bio
 * @property {Parse.GeoPoint} latestGeolocation
 * @property {String} website
 * @property {Parse.Relation<UserProfile>} followerList
 * @property {Parse.Relation<UserProfile>} followingList
 * @property {Date} lastOnline
 * @property {Boolean} certified
 * @property {Date} dob
 * @property {Parse.Relation<Tweet>} likes
 * @property {Parse.Relation<Tweet>} tweetList
 */

/**
 * @typedef User
 * @property {String} objectId
 * @property {Date} updatedAt
 * @property {Date} createdAt
 * @property {Parse.ACL} ACL
 * @property {String} username
 * @property {String} fullName
 * @property {Parse.File} avatar
 * @property {Parse.File} banner
 * @property {Date} dob
 * @property {String} email
 * @property {Parse.Pointer<UserProfile} publicProfile
 * @property {Parse.Relation<Notification>} notificationList
 * @property {Boolean} emailVerified
 * @property {Object} authData
 */

/**
 * @typedef Notification
 * @property {String} objectId
 * @property {Date} updatedAt
 * @property {Date} createdAt
 * @property {Parse.ACL} ACL
 * @property {Parse.Pointer<User>} targetUser
 * @property {Parse.Pointer<UserProfile>} senderProfile
 * @property {Parse.Pointer<Tweet>} tweetMentionned
 * @property {Boolean} read
 * @property {String} customText
 */

/**
 * @typedef Tweet
 * @property {String} objectId
 * @property {Date} updatedAt
 * @property {Date} createdAt
 * @property {Parse.ACL} ACL
 * @property {Parse.Pointer<UserProfile>} owner
 * @property {String} body
 * @property {Object} embed
 * @property {Parse.Relation<UserProfile>} likedBy
 * @property {Parse.Relation<Tweet>} answers
 * @property {Parse.Pointer<Tweet>} parent
 */

/**
 *
 * @param {Parse.User} target
 * @param {Parse.Object<UserProfile>} sender
 * @param {Parse.Object} tweet
 * @param {} text
 */

const compareOriginal = (original, changed) => {
    const diff = [];
    const originalAttributes = original.attributes;
    const changedAttributes = changed.attributes;

    for (const key of Object.keys(originalAttributes)) {
        if (originalAttributes[key] !== changedAttributes[key]) {
            diff.push(key);
        }
    }

    for (const key of Object.keys(changedAttributes)) {
        if (originalAttributes[key] !== changedAttributes[key] && !diff.includes(key)) {
            diff.push(key);
        }
    }
    return diff;
};

Parse.Cloud.beforeSave(Parse.User, async (request) => {
    const { original, object } = request;
    checkUser(object);
    if (!original) {
        // User just signed up
    } else {
        // User has already signed up
        const diff = compareOriginal(original, object);
        if (diff.length === 0) return;
        const profile = original.get('publicProfile');
        if (diff.includes('userName')) {
            profile.set('userName', object.get('userName'));
        }
        if (diff.includes('fullName')) {
            profile.set('fullName', object.get('fullName'));
        }
    }
});

Parse.Cloud.afterSave(Parse.User, async (request) => {
    const { original, object, user } = request;
    if (!original) {
        // User just signed up
        const profile = new Parse.Object('UserProfile');
        profile.set('userName', object.get('username'));
        profile.set('fullName', object.get('fullName'));
        setPublicReadPrivateWrite(profile, object);
        await profile.save(null, { useMasterKey: true, silent: true });
        object.set('publicProfile', profile);
        setPrivateReadPrivateWrite(object, object);
        await object.save(null, { useMasterKey: true, silent: true });
    }
});

const getUserByUserName = async (username) => {
    const profileQuery = new Parse.Query('User');
    return profileQuery.equalTo('userName', username).first({ useMasterKey: true });
};

const getProfileByID = async (id) => {
    const profileQuery = new Parse.Query('UserProfile');
    return profileQuery.get(id);
};

const getTweetByID = async (id, getAnswers = false) => {
    const tweetQuery = new Parse.Query('Tweet');
    const tweet = await tweetQuery.get(id);
    if (getAnswers) tweet.fetchWithInclude(['parent', 'answers']);
    return tweet;
};

const getTopicByName = async (name) => {
    const topicQuery = new Parse.Query('Hashtag');
    return topicQuery.equalTo('hashtagCI', name.toLowerCase()).first({ useMasterKey: true });
};

Parse.Cloud.define('Follow', async (request) => {
    const { user, params } = request;
    const { profileId } = params;
    const userProfile = user.get('publicProfile');
    const targetProfile = await getProfileByID(profileId);
    const followerList = targetProfile.relation('followerList');
    const followingList = userProfile.relation('followingList');
    followerList.add(userProfile);
    followingList.add(targetProfile);
    console.log(followerList);
    await userProfile.save(null, { useMasterKey: true });
    await targetProfile.save(null, { useMasterKey: true });
});

Parse.Cloud.define('toggleLike', async (request) => {
    const { user, params } = request;
    const { toggle, tweetId } = params;
    const userProfile = user.get('publicProfile');
    const tweet = await getTweetByID(tweetId);
    const likes = userProfile.relation('likes');
    const likedBy = tweet.relation('likedBy');
    if (!toggle) {
        likes.add(tweet);
        likedBy.add(userProfile);
    }
    if (toggle) {
        likes.remove(tweet);
        likedBy.remove(userProfile);
    }
    await tweet.save(null, { useMasterKey: true });
    await userProfile.save(null, { useMasterKey: true });
});

Parse.Cloud.define('Unfollow', async (request) => {
    const { user, params } = request;
    const { profileId } = params;
    const userProfile = user.get('publicProfile');
    const targetProfile = await getProfileByID(profileId);
    const followerList = targetProfile.relation('followerList');
    const followingList = userProfile.relation('followingList');
    followerList.remove(userProfile);
    followingList.remove(targetProfile);
    console.log(followerList);
    await userProfile.save(null, { useMasterKey: true });
    await targetProfile.save(null, { useMasterKey: true });
});

Parse.Cloud.define('PostTweet', async (request) => {
    const { user, params } = request;
    const { body, embed, parentId } = params;
    if (body?.length > 140 || (!embed && body?.length === 0)) throw new Error('Invalid Tixt body');
    const userProfile = user.get('publicProfile');
    const tweet = new Parse.Object('Tweet');
    tweet.set('body', body);
    tweet.set('poster', userProfile);
    tweet.set('owner', user);
    if (parentId) {
        const parentTweet = new Parse.Query('Tweet').get(parentId, { useMasterKey: true });
        tweet.set('parent', parentTweet);
    }
    tweet.set('embed', embed);
    setPublicReadPrivateWrite(tweet, user);
    await tweet.save(null, { useMasterKey: true });
    const tweetList = userProfile.relation('tweetList');
    tweetList.add(tweet);
    await userProfile.save(null, { useMasterKey: true });
    /*
    const handles = searchHandles(body);
    if (handles) {
        for (let i = 0; i < handles.length; i++) {
            console.log(handles[i].slice(2));
            const userToNotify = getUserByUserName(handles[i].slice(2));
            //sendNotification(userToNotify, userProfile, tweet);
        }
    }*/
    const tweetID = tweet.id;
    const hashtags = body.match(/(^| )#[\S]+/gm); //HASHTAG FINDER
    if (hashtags) {
        for (let i = 0; i < hashtags.length; i++) {
            if (hashtags[i][0] === ' ') {
                hashtags[i] = hashtags[i].slice(1); // FORMATTING HASHTAGS
            }
            for (let i = 0; i < hashtags.length; i++) {
                const hashtag = hashtags[i];
                const topic = await getTopicByName(hashtag);
                console.log(topic);
                if (!topic) {
                    console.log('post new topic!!!');
                    await postTopic(hashtag, tweet);
                } else {
                    console.log('topic already here');
                    await addToTopic(topic, tweet);
                }
            }
        }
    }
    return tweetID;
});

const postTopic = async (hashtag, tweet) => {
    const topic = new Parse.Object('Hashtag');
    const relTweets = topic.relation('relatedTweets');
    topic.set('hashtag', hashtag);
    topic.set('hashtagCI', hashtag.toLowerCase());
    relTweets.add(tweet);
    console.log(topic);
    await topic.save(null, { useMasterKey: true });
};

const addToTopic = async (topic, tweet) => {
    const relTweets = topic.relation('relatedTweets');
    relTweets.add(tweet);
    await topic.save(null, { useMasterKey: true });
};

const searchHandles = (msg) => {
    return msg.match(/ @[\S]+/gm);
};

const sendNotification = async (target, sender, tweet, text) => {
    const notif = Parse.Object('Notification');
    setPrivateReadPrivateWrite(notif, target);
    notif.set('targetUser', target);
    notif.set('senderProfile', sender);
    notif.set('customText', text);
    notif.set('tweetMentionned', tweet);
    await notif.save(null, { useMasterKey: true, context: { func: 'sendNotification' } });
};

Parse.Cloud.afterSave('Notification', async (request) => {
    const { context, object } = request;
    /**
     * @type {{context: Record, object: Parse.Object<Notification>}}
     */
    if (context && context['func'] === 'sendNotification') {
        const user = object.get('targetUser');
        user.relation('NotificationList').add(object);
        await user.save({ useMasterKey: true, silent: true });
    }
});

const setPublicReadPrivateWrite = (object, user) => {
    const profileACL = new Parse.ACL();
    profileACL.setPublicReadAccess(true);
    profileACL.setWriteAccess(user, true);
    object.setACL(profileACL);
};

const setPrivateReadPrivateWrite = (object, user) => {
    const profileACL = new Parse.ACL();
    profileACL.setReadAccess(user, true);
    profileACL.setPublicReadAccess(false);
    profileACL.setWriteAccess(user, true);
    object.setACL(profileACL);
};

/**
 *
 * @param {Parse.User} user
 */

const checkUser = (user) => {
    if (user.get('userName')?.length > 24) throw new Error('Your username is too long');
    if (user.get('fullName')?.length > 40) throw new Error('Your full name is too long');
};
