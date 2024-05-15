import { ActivityIndicator, Image } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/src/utils/supabase';
import fallback from '../../assets/images/fallback.png'

type RemoteImageProps = {
  path?: string | null;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!path) return;
    setLoading(true);
    (async () => {
      setImage('');
      const { data, error } = await supabase.storage
        .from('rooms')
        .download(path);

      if (error) {
        console.log(error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }

      setTimeout(() => {
        setLoading(false);
      }, 50)
    })();
  }, [path]);

  if (!image) {
  }

  return (
    <>
      {loading ?
        <>
          <Image {...imageProps} />
          <ActivityIndicator style={{
            position: 'absolute',
            top: 0,
            right: 0, 
            bottom: 0,
            left: 0,
            zIndex: 1
          }}/>
        </>
        :
        <Image source={image ? { uri: image } : fallback} {...imageProps} />
      }

    </>
  )
};

export default RemoteImage;