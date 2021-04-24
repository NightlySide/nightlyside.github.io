import React from "react";

import Github from "../../images/icons/github.svg";
import Twitter from "../../images/icons/twitter.svg";
import Reddit from "../../images/icons/reddit.svg";
import Linkedin from "../../images/icons/linkedin.svg";
import useSiteMetadata from "../../hooks/useSiteMetaData";

const Footer = () => {
	const data = useSiteMetadata();

	return (
		<div className="w-full h-48 bg-secondary flex flex-col justify-end items-center">
			<div className="flex flex-row items-center flex-grow-0 flex-shrink-0 w-44 justify-around mb-6">
				<a className="flex-auto" href={data.social.github} target="_blank" rel="noopener">
					<Github className="w-6" />
				</a>
				<a className="flex-auto" href={data.social.linkedin} target="_blank" rel="noopener">
					<Linkedin className="w-6" />
				</a>
				<a className="flex-auto" href={data.social.reddit} target="_blank" rel="noopener">
					<Reddit className="w-6" />
				</a>
				<a className="flex-auto" href={data.social.twitter} target="_blank" rel="noopener">
					<Twitter className="w-6" />
				</a>
			</div>
			<p className="text-primary text-base pb-5">© 2021 Alexandre Froehlich. All Rights Reserved.</p>
		</div>
	);
};

export default Footer;
