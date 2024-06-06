import { ActivityIndicator, Image, ImageProps } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/src/utils/supabase';
import { useImage } from '../api/rooms';
import Animated, { AnimatedProps } from 'react-native-reanimated';
const fallback = require('../../assets/images/fallback.png');

type RemoteImageProps = AnimatedProps<ImageProps> & {
  path?: string | undefined;
  profile?: boolean;
};

const RemoteImage = ({ path, profile, ...imageProps }: RemoteImageProps) => {
  const { data: image } = useImage(path, profile);

  return <Animated.Image source={image ? { uri: image } : fallback} {...imageProps} />;
};

export default RemoteImage;