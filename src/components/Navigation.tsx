import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.scss";
import { Drawer, IconButton, Typography } from "@mui/material";
import { Close, Menu } from "@mui/icons-material";

const NAV_LINKS = [
	{ href: "/#experience", label: "experience" },
	{ href: "/#projects", label: "projects" },
	{ href: "/#skills", label: "skills" },
	{ href: "/#education", label: "education" },
	{ href: "/#certifications", label: "certifications" },
	{ href: "/contact", label: "contact" },
];

const NavLink = ({
	href,
	label,
	onClick,
}: {
	href: string;
	label: string;
	onClick?: () => void;
}) =>
	href.includes("#") ? (
		<a href={href} onClick={onClick}>
			{label}
		</a>
	) : (
		<Link to={href} onClick={onClick}>
			{label}
		</Link>
	);

const Navigation = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav id="navigation" className={styles.navigation}>
			<Link to="/" className={styles.logo} aria-label="Home">
				<Typography
					fontWeight={700}
					className={styles.title}
					variant="subtitle1"
				>
					PV
				</Typography>
			</Link>
			<ul className={styles.links}>
				{NAV_LINKS.map((link) => (
					<li key={link.href}>
						<NavLink href={link.href} label={link.label} />
					</li>
				))}
			</ul>
			<IconButton
				className={styles.menuButton}
				aria-label="Open menu"
				onClick={() => setMenuOpen(true)}
			>
				<Menu />
			</IconButton>
			<Drawer
				anchor="right"
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				classes={{ paper: styles.drawerPaper }}
			>
				<IconButton
					className={styles.closeButton}
					aria-label="Close menu"
					onClick={() => setMenuOpen(false)}
				>
					<Close />
				</IconButton>
				<ul className={styles.drawerLinks}>
					{NAV_LINKS.map((link) => (
						<li key={link.href}>
							<NavLink
								href={link.href}
								label={link.label}
								onClick={() => setMenuOpen(false)}
							/>
						</li>
					))}
				</ul>
			</Drawer>
		</nav>
	);
};

export default Navigation;
