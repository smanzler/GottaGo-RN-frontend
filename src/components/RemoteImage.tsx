import { ActivityIndicator, Image } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/src/utils/supabase';
import { useImage } from '../api/rooms';
import Animated from 'react-native-reanimated';
const fallback = require('../../assets/images/fallback.png');

type RemoteImageProps = {
  path?: string | undefined;
  profile?: boolean;
  setRefetch?: (refetch: () => void) => void;
} & Omit<ComponentProps<typeof Animated.Image>, 'source'>;

const RemoteImage = ({ path, profile, setRefetch, ...imageProps }: RemoteImageProps) => {
  const { data: image, refetch } = useImage(path, profile);

  useEffect(() => {
    if (setRefetch) {
      setRefetch(refetch)
    }
  }, [refetch, setRefetch])

  return <Animated.Image source={image ? { uri: image } : fallback} {...imageProps} />;
};

export default RemoteImage;