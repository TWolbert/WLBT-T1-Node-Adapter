import axios from "axios";
import express from "express";
import fs from "fs";
const app = express();

app.get("/", async (req, res) => {
    const response = await fetch("http://localhost:8000/api/file/4?bucket=teunBucket&authKey=7a06741abcf04fab6c21e8460e4ad17b", {
        method: "GET",
        headers: {
            Authorization: "Bearer 4dc00fad86f6b60ebfde326e98749d00",
        },
    });
    // File is returned as octet-stream
    const blob = await response.blob();

    // Convert blob to buffer
    const buffer = await blob.arrayBuffer();

    // Get file name from content-disposition header
    const fileName = response.headers.get("content-disposition").split("filename=")[1];

    // Write
    fs.writeFileSync(fileName, Buffer.from(buffer));

    res.download(fileName, fileName, (err) => {
        if (err) {
            console.error(err);
        } else {
            fs.unlinkSync(fileName)
        }
    });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});