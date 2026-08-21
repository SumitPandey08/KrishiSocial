import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

interface AvatarProps {
	uri?: string | null;
	size?: number;
	onPress?: () => void;
	ringColor?: string;
	showRing?: boolean;
}

const Avatar = ({ uri, size = 56, onPress, ringColor = '#E8F5E9', showRing = false }: AvatarProps) => {
	const imageSize = size - (showRing ? 10 : 4);

	const content = (
		<View style={[styles.ring, showRing ? { borderColor: ringColor, borderWidth: 3 } : { borderWidth: 0 }]}> 
			{uri ? (
				<Image
					source={{ uri }}
					style={[styles.image, { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }]}
				/>
			) : (
				<View style={[styles.fallback, { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }]} />
			)}
		</View>
	);

	if (onPress) {
		return (
			<TouchableOpacity activeOpacity={0.75} onPress={onPress}>
				{content}
			</TouchableOpacity>
		);
	}

	return content;
};

const styles = StyleSheet.create({
	ring: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 999,
		padding: 4,
		backgroundColor: 'transparent',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 6,
		elevation: 2,
	},
	image: {
		backgroundColor: '#E1E1E1',
	},
	fallback: {
		backgroundColor: '#D1D5DB',
	},
});

export default Avatar;
