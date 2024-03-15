import { FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Overlay } from "@rneui/themed";
import Ionicons from 'react-native-vector-icons/Ionicons';
import LikeBtn from "../LikeBtn";
import { useContext, useState } from "react";
import AvatarCustom from "../AvatarCustom";
import { Button } from "@rneui/base";
import AuthContext from "../../context/AuthContext";

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function Post(props) {
    const { user } = useContext(AuthContext);
    const { data } = props;
    const [visible, setVisible] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);

    const navigation = useNavigation();
    const { colors } = useTheme();

    const [isExpand, setIsExpand] = useState(false);
    const minHeight = {
        height: 100
    };
    
    const showImage = (index) => {
        setImgIndex(index)
        setVisible(true)
    }

    const [isOpen, setIsOpen] = useState(false);
    
    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AvatarCustom data={{
                    created_by: data.created_by,
                    avatar: data.avatar,
                    username: data.username,
                    created_at: data.created_at
                }} />
                <Ionicons
                    name='ellipsis-horizontal'
                    size={24}
                    color={colors.icon_secondary}
                    onPress={() => setIsOpen(!isOpen)}
                />
                {isOpen &&
                    <View>
                        <Button>
                            Report
                            <Ionicons name='alert-circle-outline' />
                        </Button>
                        {data.created_by === user.id &&
                        
                        <Button>
                            Delete
                            <Ionicons name='trash-outline'/>
                        </Button>
                        }
                    </View>    
                }
            </View>

            <Pressable onPress={() => navigation.navigate('Post', { id: data.id })}>
                {data.content.length > 100
                    ?
                <View style={[!isExpand && minHeight, {position: 'relative'}]}>
                    <Text style={[styles.content, { color: colors.text }]}>{data.content}</Text>
                    <Pressable
                        onPress={()=> setIsExpand(!isExpand)}
                        style={[styles.expand_btn, isExpand && {bottom: -2}, {backgroundColor: colors.text_secondary}]}
                    >
                        <Text style={{ color: colors.icon, textAlign: 'center' }}>{isExpand ? 'Hide' : 'More'}</Text>
                    </Pressable>
                </View>
                    :
                <Text style={[styles.content,{color: colors.text}]}>{data.content}</Text>
                }
                <View style={styles.img_container}>
                    {data.images.length === 1
                        ?
                        <Image
                            source={{ uri: data.images[0].img_url }}
                            style={styles.img_medium}
                            resizeMode='contain'
                        />
                        :
                        <View style={styles.img_wrapper}>
                            {data.images.map((img, index) => 
                                <Pressable
                                    key={index}
                                    onPress={() => showImage(data.images.indexOf(img))}>
                                    <Image
                                        source={{ uri: img.img_url }}
                                        key={img.img_url}
                                        style={styles.img_small}
                                    />
                                </Pressable>
                            )}
                        </View>
                    }
                </View>
            </Pressable>
            <View style={styles.footer}>
            <LikeBtn
                data={{
                    is_like: data.is_like,
                    post_id: data.id
                }}
            />
            <Ionicons
                name='chatbox-outline'
                size={24}
                onPress={() => navigation.navigate('Post', { id: data.id })}
                color={colors.icon_secondary}
            />
            <Ionicons
                name='share-social-outline'
                size={24}
                color={colors.icon_secondary} 
            />
            </View>
            <Overlay
                overlayStyle={styles.overlay}
                isVisible={visible}
                onBackdropPress={() => setVisible(!visible)}
            >
                <FlatList
                    data={data.images}
                    horizontal
                    pagingEnabled
                    snapToInterval={360}
                    decelerationRate={'normal'}
                    bounces={false}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => setVisible(!visible)}
                            style={{
                                width: screenWidth,
                                height: screenHeight
                            }}
                        >
                        <Image
                            source={{ uri: item.img_url }}
                            style={{
                                width: screenWidth,
                                height: screenHeight * 0.9,
                            }}
                            resizeMode="contain"
                        />
                        </Pressable>
                    )}
                />
            </Overlay>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn_group: {
        backgroundColor: 'red'
    },
    content: {
        fontSize: 20,
        marginLeft: 40,
        paddingBottom: 12,
    },
    expand_btn: {
        position: 'absolute',
        right: 40,
        bottom: 10,
        width: '77%',
        opacity: 0.8
    },
    img_container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    img_wrapper: {
        width: 255,
        maxHeight: 357,
        paddingVertical: 2,
        borderWidth: 2,
        borderRadius: 9,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderColor: 'silver',
        backgroundColor: 'silver',
        overflow: 'hidden'
    },
    img_small: {
        width: 125,
        height: 175,
    },
    img_medium: {
        width: 125,
        height: 175
    },

    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 55,
        marginTop: 10
    },

    overlay: {
        backgroundColor: 'rgba(255,255,255,0)'
    }
})