/*
 * Copyright (c) 2022 Eliott Guillaumin
 * All rights reserved.
 */
// material-ui
import { Button, List, Stack, Typography, Box, useTheme, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ListItemCustom from '../../ListItemCustom';
import { DatePicker, DateTimePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import dayjs from 'dayjs';
import serverApi from '../../api/serverApi';
import useApi from '../../hooks/useApi';

// ==============================|| SAMPLE PAGE ||============================== //

const UserSchema = Yup.object().shape({
    fullName: Yup.string().min(3, 'Full Name must be longer than 3 characters').max(20),
    dob: Yup.date(),
    email: Yup.string().email('You must use a valid email'),
    color: Yup.string().matches(/#[0-9a-fA-F]*/gm),
    img: Yup.string().url()
});

const SamplePage = () => {
    const { create } = require('apisauce');

    const discordApi = create({
        baseURL: 'secret hahaha',
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        }
    });

    const itemsDefaultExample = [
        {
            fullName: 'Eliott Williams',
            dob: dayjs('01/01/1990'),
            email: 'eliott@blacklight.tv',
            color: 'red',
            objectId: 123456,
            img: ''
        },
        {
            fullName: 'Alexandre Netchaev',
            dob: dayjs('11/24/2001'),
            email: 'alexandre.netchaev24@gmail.com',
            color: 'cyan',
            objectId: 123457,
            img: 'http://pm1.narvii.com/6898/81c65f41fa1bb2c27e1d8684b91128e547adceb1r1-550-485v2_uhq.jpg'
        },
        {
            fullName: 'Joseph Joestar',
            dob: dayjs('05/06/1980'),
            email: 'joseph@speedwagon.com',
            objectId: 123450,
            color: 'brown'
        }
    ];

    //#region States
    const theme = useTheme();
    const colors = theme.palette;
    const { request: requestUsers, data: items, loading: usersLoading } = useApi(serverApi.getUsers);

    const [x, setX] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const selectedItem = items.find((it) => it.objectId === selectedId);
    const [editMode, setEditMode] = useState(false);

    //#endregion

    const selectItem = (inputId) => {
        if (selectedId && selectedId === inputId) {
            setSelectedId(null);
        } else {
            setSelectedId(inputId);
        }
    };

    const addItem = async (itemToAdd) => {
        try {
            const ret = await serverApi.addUser(itemToAdd);
            requestUsers();
        } catch (error) {
            console.error(error);
        }
        // setItems(items.concat([itemToAdd]));
    };

    const deleteItem = async () => {
        try {
            await serverApi.deleteUser(selectedItem);
            requestUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = async (valuesCurrent, { setSubmitting, resetForm, setErrors }) => {
        setSubmitting(true);
        if (editMode && selectedId) {
            const newItem = { ...selectedItem, ...valuesCurrent, dob: dayjs(valuesCurrent?.dob).toDate() };
            try {
                const ret = await serverApi.editUser(newItem);
                requestUsers();
            } catch (error) {
                console.error(error);
            }
            return;
        }
        await addItem(valuesCurrent);
        setSubmitting(false);
    };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            fullName: 'aaaaa',
            dob: undefined,
            email: 'a@a.fr',
            color: '#aaa',
            img: 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fcours-informatique-gratuit.fr%2Fwp-content%2Fuploads%2F2017%2F10%2Favatar.png&sp=1662417082T46d4981ce48110733d8991dab0a4923c66d58c8483117a4acdb059adce72c4b9'
        },
        validationSchema: UserSchema,
        onSubmit: onSubmit
    });

    const { errors, values, touched, handleSubmit, isSubmitting, setValues, setFieldValue, getFieldProps, resetForm } = formik;

    useEffect(() => {
        if (!editMode || !selectedId) return;
        const item = items.find((it) => it.objectId === selectedId);
        setValues(item, false);
    }, [editMode, selectedId]);

    useEffect(() => {
        if (editMode) return;
        resetForm();
    }, [editMode]);

    useEffect(() => {
        requestUsers();
    }, []);

    const list = async () => {
        console.log('---------');
        const diff = [];
        itemsDefaultExample.filter((x) => {
            if (!items.some((it) => it.objectId === x.objectId)) {
                diff.push(x);
            }
        });

        console.log('REMOVED ELEMENTS : ');
        let string = stringed_list(diff);
        if (string === '') string = 'Nothing here';
        const ret1 = await discordApi.post(null, {
            username: 'ALEXANDRE DELETE',
            content: '```json\n' + string + '```'
        });
        const newelt = [];
        items.filter((x) => {
            if (!itemsDefaultExample.some((it) => it.objectId === x.objectId)) {
                newelt.push(x);
            }
        });

        console.log('NEW ELEMENTS : ');
        string = stringed_list(newelt);
        if (string === '') string = 'Nothing here';
        const ret2 = await discordApi.post(null, { username: 'ALEXANDRE POST', content: '```json\n' + string + '```' });
        const editelt = [];
        items.filter((x) => {
            for (let i = 0; i < itemsDefaultExample.length; i++) {
                if (itemsDefaultExample[i].objectId === x.objectId) {
                    if (JSON.stringify(itemsDefaultExample[i]) !== JSON.stringify(x)) {
                        editelt.push(x);
                    }
                }
            }
        });

        console.log('EDIT : ');
        string = stringed_list(editelt);
        if (string === '') string = 'Nothing here';
        const ret3 = await discordApi.post(null, {
            username: 'ALEXANDRE PUT',
            content: '```json\n' + string + '```'
        });
    };

    function stringed_list(arr) {
        let str = '';
        arr.forEach((x) => {
            str = str.concat(JSON.stringify(x));
        });
        // str = str.concat('---------');
        return str;
    }

    const test = () => {
        if (x !== 20) {
            setX(x + 1);
        }
    };

    return (
        <MainCard title="Sample Card">
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button color="success" variant="contained" onClick={test}>
                    Test
                </Button>
                <Button color="primary" variant="contained" onClick={list}>
                    List
                </Button>
                <Button color={editMode ? 'warning' : 'primary'} size="medium" variant="contained" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Stop editing' : 'Edit row'}
                </Button>
                <Button color="error" size="medium" variant="contained" onClick={deleteItem}>
                    Delete
                </Button>
                <LoadingButton onClick={requestUsers} variant="contained" size="medium" loading={usersLoading}>
                    Refresh
                </LoadingButton>
            </Stack>

            <Stack
                direction="column"
                style={{ paddingTop: 10 }}
                divider={<Box style={{ width: '70%', alignSelf: 'center', height: 1, backgroundColor: colors.divider }} />}
            >
                {items?.map((value, index) => (
                    <ListItemCustom item={value} key={index} selectItem={selectItem} selectedId={selectedId} />
                ))}

                <FormikProvider value={formik}>
                    <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Stack direction="column" spacing={3} padding={5}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                {...getFieldProps('fullName')}
                                error={Boolean(touched.fullName && errors.fullName)}
                                helperText={touched.fullName && errors.fullName}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                {...getFieldProps('email')}
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    disableFuture
                                    openTo="year"
                                    label="Date of birth"
                                    {...getFieldProps('dob')}
                                    onChange={(date) => setFieldValue('dob', date)}
                                    renderInput={(props) => <TextField {...props} fullWidth error={Boolean(touched.dob && errors.dob)} />}
                                    inputFormat="DD/MM/YYYY"
                                />
                            </LocalizationProvider>
                            <TextField
                                fullWidth
                                label="Color"
                                {...getFieldProps('color')}
                                error={Boolean(touched.color && errors.color)}
                                helperText={touched.color && errors.color}
                            />
                            <Stack direction="row" spacing={3}>
                                <Button onClick={resetForm} fullWidth variant="contained" size="large" color="error">
                                    Reset
                                </Button>
                                <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                                    Send
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </Form>
                </FormikProvider>
                <Typography variant="body2">
                    Compteur: {x}
                    <br />
                    Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa.
                    Ut enif ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube
                    grue dolor in reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non
                    president, sunk in culpa qui officiate descent molls anim id est labours.
                </Typography>
            </Stack>
        </MainCard>
    );
};

export default SamplePage;
