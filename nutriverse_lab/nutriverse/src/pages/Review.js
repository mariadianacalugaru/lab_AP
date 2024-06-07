import React from 'react'
import { useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Button from 'react-bootstrap/Button';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import {
    MDBCardTitle,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBTextArea,
    MDBBtn,
} from 'mdb-react-ui-kit';

const Review = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get("nutr"))
    const navigate = useNavigate()
    const [value, setValue] = useState(0);
    const [review, setReview] = useState(true)
    const [list_reviews, setListReviews] = useState([])

    const handleSendReview = async () => {
        var review = document.getElementById("comment").value
        const configuration = {
            method: "post",
            url: "http://localhost:4000/add_review",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            withCredentials: true,
            data: {
                star: value,
                review: review,
                nutritionist: email
            }
        };
        try {
            await axios(configuration)
                .then((res) => {
                    if (res.data == "not logged") {
                        navigate("/")
                    }
                    else {
                        window.location.reload()
                    }

                })
                .catch((event) => {
                    console.log(event);
                });
        } catch (event) {
            console.log(event);
        }

    }

    const handleReview = () => {
        if (value == null || value == 0 || document.getElementById("comment").value == "") {
            setReview(true)
        }
        else {
            setReview(false)
        }
    }

    const handleStar = (newValue) => {
        if (newValue == null || newValue == 0 || document.getElementById("comment").value == "") {
            setReview(true)
        }
        else {
            setReview(false)
        }
    }


    const [get_info, setGetInfo] = useState(false)

    useEffect(() => {
        const configuration = {
            method: "GET",
            url: "http://localhost:4000/get_reviews?email=" + email,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            withCredentials: true,
        };

        const get_reviews = () => {
            setGetInfo(true)
            try {
                axios(configuration)
                    .then((res) => {
                        if (res.data == "not logged") {
                            navigate("/")
                        }
                        setListReviews(res.data)
                    })
                    .catch((event) => {
                        console.log(event);
                    });
            } catch (error) {
                console.log(error);
            }

        }
        if (!get_info) {
            get_reviews()
        }
    });
    return (
        <>
            {list_reviews.map((user) => (
                <Card>
                    <Card.Title>{user.firstname}{user.lastname}</Card.Title>
                    <Card.Body>
                        <Card.Text>
                            {user.comment}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
            <MDBCard id='review'>
                <MDBCardBody>
                    <MDBCardTitle>Write a review</MDBCardTitle>
                    <MDBTextArea onChange={handleReview} id="comment" placeholder='Leave a comment about your experience with this nutritionist'>
                    </MDBTextArea>
                    <Box
                        sx={{
                            '& > legend': { mt: 2 },
                        }}
                    >
                        <Typography component="legend"> Rate the nutritionist</Typography>
                        <Rating
                            id="star"
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                                handleStar(newValue)
                            }}
                        />
                    </Box>
                    <Button disabled={review} onClick={handleSendReview}> Send review </Button>
                </MDBCardBody>
            </MDBCard>
        </>
    )
}

export default Review