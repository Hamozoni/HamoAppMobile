import { Status } from "../types/components.types";

export const STATUSES: Status[] = [
    {
        name: "John Doe",
        photoURL: require("../assets/images/pexels-nati-87264186-34295251.jpg"),
        _id: "1",
        statuses: [
            {
                id: 1,
                type: "image",
                photoURL: require("../assets/images/pexels-nati-87264186-34295251.jpg"),
                createdAt: "2025-12-16T17:14:06.000Z"
            },
            {
                id: 2,
                type: "video",
                thumbnail: require("../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg"),
                videoURL: require("../assets/videos/v1.mp4"),
                createdAt: "2025-12-16T17:14:06.000Z",
                durationInSec: 40
            }
        ]
    },
    {
        name: "Ahmed Hassan",
        photoURL: require("../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg"),
        _id: "2",
        statuses: [
            {
                id: 4,
                type: "image",
                photoURL: require("../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg"),
                createdAt: "2025-12-16T17:14:06.000Z"
            },
            {
                id: 5,
                type: "video",
                thumbnail: require("../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg"),
                videoURL: require("../assets/videos/v1.mp4"),
                createdAt: "2025-12-16T17:14:06.000Z",
                durationInSec: 40
            }
        ]
    },
    {
        name: "Nati Nati",
        photoURL: require("../assets/images/pexels-nati-87264186-34295251.jpg"),
        _id: "3",
        statuses: [
            {
                id: 6,
                type: "text",
                text: "Hello",
                bgColor: "#fff",
                textColor: "#000",
                createdAt: "2025-12-16T17:14:06.000Z"
            },
            {
                id: 7,
                type: "image",
                photoURL: require("../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg"),
                createdAt: "2025-12-16T17:14:06.000Z"
            },
            {
                id: 8,
                type: "video",
                thumbnail: require("../assets/images/pexels-al-amin-muhammad-988616478-29680723.jpg"),
                videoURL: require("../assets/videos/v1.mp4"),
                createdAt: "2025-12-16T17:14:06.000Z",
                durationInSec: 40
            }
        ]
    },
    {
        name: "Husam Mohamed",
        photoURL: require("../assets/images/pexels-nati-87264186-34295251.jpg"),
        _id: "4",
        statuses: [
            {
                id: 9,
                type: "text",
                text: "Hello",
                bgColor: "#f3f3f3ff",
                textColor: "#000",
                createdAt: "2025-12-16T17:14:06.000Z"
            },
            {
                id: 10,
                type: "image",
                photoURL: require("../assets/images/pexels-nati-87264186-34295251.jpg"),
                createdAt: "2025-12-16T17:14:06.000Z"
            }
        ]
    },
];
