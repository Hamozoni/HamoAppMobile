import ZoomableImage from "../mediaGallery/zoomableImage";
import VideoPlayer from "../mediaGallery/videoPlayer";
import React from "react";

interface MediaGalleryMetaData {
    type: 'image' | 'video' | string;
    file: any;
}

interface MediaGalleryCardProps {
    metaData: MediaGalleryMetaData;
}

export default function MediaGalleryCard({ metaData }: MediaGalleryCardProps) {

    const CardComponent = (): React.ReactElement | null => {
        switch (metaData.type) {
            case "image":
                return <ZoomableImage url={metaData.file.secureUrl} />;
            case "video":
                return <VideoPlayer url={metaData.file.secureUrl} />;
            default:
                return null;
        }
    }

    return (
        <CardComponent />
    );
}
