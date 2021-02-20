import React from "react";
import Linkify from 'react-linkify';
import LinkifyIt from 'linkify-it';
import tlds from 'tlds';

const linkify = new LinkifyIt();
linkify
  .tlds(tlds)
  .add('tg:', 'http:')

const ClickableComponent = (decoratedHref, decoratedText, key) => {
    return (
    <a href={decoratedHref} key={key} className="text-blue-500">
      {decoratedText}
    </a>

    )
}

const MyLinkify = ({ children }) => (
    <Linkify
        matchDecorator={(text) => linkify.match(text)}
        componentDecorator={ClickableComponent}
    >
        {children}
    </Linkify>
)

export default MyLinkify;