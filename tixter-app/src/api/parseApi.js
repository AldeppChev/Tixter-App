import Parse from 'parse';

// INITIALISATION

const initParse = () => {
    Parse.initialize('iY6SgEWvTJPkV9rulbavNZHACITesYnO0wo08mpv', 'Hwxk6GJJC4LHe38jNqgOTYoxzu3TEg6X6PNSlqCS');
    Parse.serverURL = 'https://parseapi.back4app.com';
};

const logIn = async (username, password) => {
    const user = new Parse.User({ username, password });
    return user.logIn();
};

const signUp = async (username, password, props) => {
    const user = new Parse.User({ username, password, ...props });
    return user.signUp();
};

const logOut = Parse.User.logOut;

// GETTERS

const currentUser = Parse.User.current;

const currentUserProfile = async () => {
    const user = currentUser();
    const profile = await getProfileByUserName(user.get('username'));
    await profile.fetch();
    return profile;
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

/**
 *
 * @param {Parse.Object} userProfile
 * @param {number} skip
 * @param {number} limit
 * @returns
 */

const getFollowersFromProfile = async (userProfile, skip = 0, limit = 100) => {
    return userProfile.relation('followerList').query().skip(skip).limit(limit).find();
};

/**
 *
 * @param {Parse.Object} userProfile
 * @param {number} skip
 * @param {number} limit
 * @returns
 */

const getFollowingFromProfile = async (userProfile, skip = 0, limit = 100) => {
    return userProfile.relation('followingList').query().skip(skip).limit(limit).find();
};

const getLikesFromTweet = async (tweet) => {
    return tweet.relation('likedBy').query().find();
};

/**
 *
 * @param {Parse.Object} userProfile
 * @param {number} skip
 * @param {number} limit
 * @returns
 */

/**
 *
 * @param {Parse.Object} userProfile
 * @param {number} skip
 * @param {number} limit
 * @returns
 */

const getLikedTweetsFromProfile = async (userProfile, skip = 0, limit = 100) => {
    return userProfile.relation('likes').query.skip(skip).limit(limit).find();
};

// CHANGE FIELDS

const editProfile = async (userProfile, object) => {
    await userProfile.save(object);
};

const changeUserAvatar = async (userProfile, profilePicture) => {
    const user = currentUser();
    const avatar = new Parse.File(profilePicture.name, profilePicture);
    user.set('avatar', avatar);
    await user.save();
    userProfile.set('avatarUrl', avatar._url);
    await userProfile.save();
};

const changeUserBanner = async (userProfile, bannerImage) => {
    const user = currentUser();
    const banner = new Parse.File(bannerImage.name, bannerImage);
    user.set('banner', banner);
    await user.save();
    userProfile.set('bannerUrl', banner._url);
    await userProfile.save();
};

const postTweet = async (body) => {
    return Parse.Cloud.run('PostTweet', { body });
};

const follow = async (profileId) => {
    return Parse.Cloud.run('Follow', { profileId });
};

const toggleLike = async (toggle, tweetId) => {
    return Parse.Cloud.run('toggleLike', { toggle, tweetId });
};

const unfollow = async (profileId) => {
    return Parse.Cloud.run('Unfollow', { profileId });
};

/**
 *
 * @param {Parse.Object<UserProfile>} profile
 * @returns {Promise<Parse.Object[]>}
 */
const getTweets = async (profile) => {
    const tweets = await profile?.relation('tweetList').query().find();
    for (const t of tweets) {
        await t.fetch();
    }
    return tweets;
};
/**
 *
 * @param {Parse.Object[]} followingsList
 * @returns
 */
const getTweetsFromFollowings = async (followingsList) => {
    let tweetList = [];
    for (const following of followingsList) {
        const tmpTweets = await getTweets(following);
        tweetList = tweetList.concat(tmpTweets);
    }
    console.log('RESULT');
    console.log(tweetList);
    return tweetList;
};

const getTweetsFromHashtag = async (hashtag) => {
    const tweets = await hashtag?.relation('relatedTweets').query().find();
    for (const t of tweets) {
        await t.fetch();
    }
    return tweets;
};

const getProfileByUserName = async (username) => {
    const profileQuery = new Parse.Query('UserProfile');
    const profile = await profileQuery.equalTo('userName', username).first();
    await profile.fetch();
    return profile;
};

const getTopicByName = async (name) => {
    const topicQuery = new Parse.Query('Hashtag');
    const hashtag = await topicQuery.equalTo('hashtagCI', name.toLowerCase()).first();
    await hashtag.fetch();
    return hashtag;
};

export default {
    initParse,
    logIn,
    signUp,
    logOut,
    currentUser,
    currentUserProfile,
    getProfileByID,
    getProfileByUserName,
    getTweetByID,
    getFollowersFromProfile,
    getFollowingFromProfile,
    getLikedTweetsFromProfile,
    getTweetsFromFollowings,
    getLikesFromTweet,
    editProfile,
    changeUserAvatar,
    changeUserBanner,
    getTweets,
    getTweetsFromHashtag,
    getTopicByName,
    postTweet,
    toggleLike,
    follow,
    unfollow
};
