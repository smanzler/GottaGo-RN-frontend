import { ActivityIndicator, Image } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/src/utils/supabase';
import { useImage } from '../api/rooms';
const fallback = require('../../assets/images/fallback.png');

type RemoteImageProps = {
  path?: string | null;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, ...imageProps }: RemoteImageProps) => {
  const { data: image } = useImage(path)
  
  return <Image source={image ? { uri: image } : fallback} {...imageProps} />;
};

export default RemoteImage;