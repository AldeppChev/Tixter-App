/*
 * Copyright (c) 2022 Eliott Guillaumin
 * All rights reserved.
 */
import { Avatar, Box, Checkbox, Stack, styled, Typography } from '@mui/material';
import dayjs from 'dayjs';

const ItemStack = styled(Stack)(({ theme }) => ({
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    overflow: 'hidden'
}));

const ItemTypo = styled(Typography)(({ theme }) => ({
    flex: 1,
    textAlign: 'center'
}));

const ItemBox = styled(Box)(({ theme }) => ({
    height: 30,
    width: 50,
    marginHorizontal: 20
}));

/**
 *
 * @typedef userItem
 * @property {String} fullName
 * @property {String} email
 * @property {String} color
 * @property {Date} dob
 * @property {String} objectId
 *
 */

/**
 *
 * @param {{item : userItem, selectedId: Number, selectItem: Function}} param0
 * @returns
 */
function ListItemCustom({ item, selectedId, selectItem }) {
    return (
        <ItemStack direction="row" spacing={3}>
            <Checkbox checked={selectedId === item?.objectId} onChange={() => selectItem(item?.objectId)} value={item?.objectId} />
            <Avatar height={40} width={40} src={item?.img} />
            <ItemTypo variant="h5" color="GrayText" style={{ flex: 3 }}>
                {item?.fullName}
            </ItemTypo>
            <ItemTypo variant="h5" color="GrayText" style={{ flex: 0.5 }}>
                {dayjs().diff(item?.dob?.iso, 'years')}
            </ItemTypo>
            <ItemTypo variant="h5" color="GrayText" style={{ flex: 5 }}>
                {item?.email}
            </ItemTypo>
            <ItemBox style={{ backgroundColor: item?.color }} />
        </ItemStack>
    );
}

export default ListItemCustom;
