import React from 'react';
import { marked } from 'marked';
import { Message } from '../../types';

export interface MessageViewProps {
	message: Message;
}

export default function MessageView({ message }: MessageViewProps) {
    const hasImages = message.images.length > 0;

	return (
		<div className="box">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(message.content!) }}></div>
            {hasImages && (
                <div className="images my-2">
                    <div className="has-text-grey is-size-7">Attached Images</div>
                    <div className="image-list my-2">
                        {message.images.map(image => {
                            return (
                                <div className="card" key={image.url}>
                                    <div className="card-image">
                                        <figure className="image">
                                            <img src={image.url} />
                                        </figure>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className="has-text-weight-semibold mt-2">{message.handle}</div>
        </div>
	)
}
