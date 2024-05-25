import { ActivityIndicator, Image } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/src/utils/supabase';
import { useImage } from '../api/rooms';
import Animated from 'react-native-reanimated';
const fallback = require('../../assets/images/fallback.png');

type RemoteImageProps = {
  path?: string | undefined;
  profile?: boolean;
} & Omit<ComponentProps<typeof Animated.Image>, 'source'>;

const RemoteImage = ({ path, profile, ...imageProps }: RemoteImageProps) => {
  const { data: image } = useImage(path, profile);

  return <Animated.Image source={image ? { uri: image } : fallback} {...imageProps} />;
};

export default RemoteImage;