import tw from 'twrnc'
import * as MediaLibrary from 'expo-media-library';
import { Image, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { AssetInfo } from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Skeleton } from 'native-base';

interface CustomAssetProps {
  thumbnailUri?: string
}
type AssetProps = CustomAssetProps & AssetInfo;

export default function MediaList() {
  const [mediaList, setMediaList] = useState([] as AssetProps[]);

  useEffect(() => {
    getMediaList()
  }, [])

  const generateVideoThumbnail = async (videoUri: string | undefined) => {
    try {
      if (!videoUri) {
        return
      }

      const { uri } = await VideoThumbnails.getThumbnailAsync(
        videoUri,
        {
          time: 0,
        }
      );
      return uri;
    } catch (e) {
      console.warn(e);
    }
  };

  const getMediaList = async() => {
    try {
      await MediaLibrary.requestPermissionsAsync();
      const getAllMedia = await MediaLibrary.getAssetsAsync({
        first: 130,
        sortBy: ['creationTime'],
        mediaType: ['photo', 'video']
      })

      const mediaListInfo = await Promise.all(
        getAllMedia.assets.map(asset => MediaLibrary.getAssetInfoAsync(asset.id))
      )
      setMediaList(await Promise.all(
        mediaListInfo.map(async (mediaItem) => {
        if (mediaItem.mediaType === 'video') {
          return { ...mediaItem, thumbnailUri: await generateVideoThumbnail(mediaItem.localUri) }
        }
        return  mediaItem
      })));
    } catch (error) {
      console.log(error)
    }
  }

  function convertHMS(value: any) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours:any   = Math.floor(sec / 3600); // get hours
    let minutes:any = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds:any = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if (hours === '00') {
      return minutes+':'+seconds;
    }
    return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
  }

  return (
      <View style={tw`flex flex-wrap w-full flex-row p-.3`}>
      {mediaList ? <FlatList data={mediaList} keyExtractor={(media) => media.id} renderItem={(media) => (
        <View
          style={tw`flex flex-col w-1/4 aspect-square p-.3 relative`}
        >
          {media.item.localUri ? (
            <Image
              style={tw`h-full w-full rounded`}
              source={{ uri: media.item.mediaType === 'photo' ? media.item.localUri : media.item.thumbnailUri }}
            />
          ):(
            <Skeleton h="100%" w="100%" />
          )}
          {media.item.duration ?
            <Text style={tw`absolute right-0 p-1.2 text-white text-xs`}>
              {convertHMS(media.item.duration)}
            </Text>
            : null}
        </View>
      )} /> : (
        <View style={tw`h-full w-full flex items-center justify-center`}>
          <Text>Loading</Text>
          <ActivityIndicator />
        </View>
      ) }
      </View>
  );
}
