import * as React from "react";
import { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`,
	};
}

export default function VerticalTabs() {
	const [value, setValue] = useState(0);
	const [images, setImages] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await axios.get(
					"https://picsum.photos/v2/list?page=1&limit=100"
				);
				const imageUrls = response.data.map(
					(image: { download_url: string }) => image.download_url
				);
				setImages(imageUrls);
			} catch (err) {
				setError("Failed to fetch images");
			}
		};

		fetchImages();
	}, []);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleImageClick = (url: string) => {
		setPreviewImage(url);
	};

	const handleClosePreview = () => {
		setPreviewImage(null);
	};

	return (
		<Box
			sx={{
				flexGrow: 1,
				bgcolor: "background.paper",
				display: "flex",
			}}
		>
			<Tabs
				orientation="vertical"
				value={value}
				onChange={handleChange}
				aria-label="Vertical tabs example"
				sx={{
					borderRight: 1,
					borderColor: "divider",
					minWidth: 150,
					"& .Mui-selected": { bgcolor: "primary.main", color: "white" },
				}}
			>
				<Tab label="Image" {...a11yProps(0)} />
				<Tab label="Media" {...a11yProps(1)} />
				<Tab label="Others" {...a11yProps(2)} />
			</Tabs>
			<TabPanel value={value} index={0}>
				<div>
					{error && <p>{error}</p>}

					{/* Display Images with Conditional Layout for Preview */}
					{previewImage ? (
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							{/* Image Grid for First Two Rows */}
							<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
								{images.slice(0, 8).map((url, index) => (
									<img
										key={index}
										src={url}
										alt={`Thumbnail ${index}`}
										style={{ width: "25%", height: "auto", cursor: "pointer" }}
										onClick={() => handleImageClick(url)}
									/>
								))}
							</div>

							{/* Image Preview Panel */}
							<Box
								sx={{
									position: "relative",
									marginTop: 2,
									padding: 2,
									border: "1px solid",
									borderColor: "divider",
									borderRadius: 1,
									width: "100%",
									height: "400px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "background.default",
								}}
							>
								<IconButton
									aria-label="close"
									onClick={handleClosePreview}
									sx={{
										position: "absolute",
										top: 8,
										right: 8,
										color: "grey.500",
									}}
								>
									<CloseIcon />
								</IconButton>
								<img
									src={previewImage}
									alt="Preview"
									style={{ maxHeight: "100%", maxWidth: "100%" }}
								/>
							</Box>
						</Box>
					) : (
						/* Standard 4-Image Per Row Layout */
						<div style={{ display: "flex", flexWrap: "wrap" }}>
							{images.map((url, index) => (
								<img
									key={index}
									src={url}
									alt={`Random ${index}`}
									style={{ width: "25%", height: "auto", cursor: "pointer" }}
									onClick={() => handleImageClick(url)}
								/>
							))}
						</div>
					)}
				</div>
			</TabPanel>
			<TabPanel value={value} index={1}>
				Media
			</TabPanel>
			<TabPanel value={value} index={2}>
				Others
			</TabPanel>
		</Box>
	);
}
