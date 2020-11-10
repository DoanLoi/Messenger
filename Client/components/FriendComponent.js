import React, { Component } from "react"
import {
    Container, Content, Card, CardItem,
    Left, Thumbnail, Header, Button,
    Body, Title, Right,
    Text, H2, Badge,
    List, ListItem, View, Input, InputGroup,
    Tabs, Tab
} from 'native-base'
import { StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import { Ionicons } from '@expo/vector-icons'
import { host, linkImage } from "../linkHost"
import ListFriend from "./ListFriend"
const height = Dimensions.get('window').width;
class AddFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inviteFrineds: [],
            sendFriends: []
        }
    }

    fetchData = () => {
        const self = this;
        fetch(host + "/invite-friends", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {

                // Read the response as json.
                return response.json();
            })
            .then(function (responseAsJson) {
                self.setState({ inviteFriends: responseAsJson.inviteFriends, sendFriends: responseAsJson.sendFriends });


            })
            .catch(function (error) {
                console.log(error);
            });
    }
    componentDidMount() {

        this.fetchData();
    }

    render() {
        const { inviteFriends, sendFriends } = this.state;

        return (
            <View>
                <View>
                    <Text style={styles.title}>Lời mời kết bạn</Text>
                    <List

                        dataArray={inviteFriends}
                        renderItem={({ item, index }) => {
                            return (
                                <Card transparent style={{ height: 100 }}>
                                    <CardItem>



                                        <Thumbnail source={{ uri: linkImage + item.avatar }}></Thumbnail>
                                        <Body style={{ marginLeft: 20 }}>
                                            <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                                <Button primary style={{ marginRight: 10, borderRadius: 8 }} >
                                                    <Text>Đồng ý</Text>
                                                </Button>
                                                <Button danger style={{ borderRadius: 8 }}>
                                                    <Text>Từ chối</Text>
                                                </Button>
                                            </View>



                                        </Body>





                                    </CardItem>
                                </Card>

                            );
                        }}
                    >

                    </List>


                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: "row", height: 40, marginTop: 30 }}>
                    <Button style={{
                        borderRadius: 20,
                        backgroundColor: "#dedbd5",
                        flex: 1,
                        marginHorizontal: 30,
                        height: 35,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <Text style={{ fontSize: 12, color: 'black' }}>Xem tất cả</Text>

                    </Button>
                </View>

                <View style={{ flex: 1, height: 1, backgroundColor: "gray", margin: 20 }}></View>
                <View>
                    <Text style={styles.title}>Đang chờ xác nhận</Text>

                    <List

                        dataArray={sendFriends}
                        renderItem={({ item, index }) => {
                            return (
                                <Card transparent style={{ height: 100 }}>
                                    <CardItem style={{ backgroundColor: "#e6e8e8" }}>



                                        <Thumbnail source={{ uri: linkImage + item.avatar }}></Thumbnail>
                                        <Body style={{ marginLeft: 20 }}>
                                            <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>

                                                <Button danger style={{ borderRadius: 8 }}>
                                                    <Text>Hủy yêu cầu</Text>
                                                </Button>
                                            </View>



                                        </Body>





                                    </CardItem>
                                </Card>

                            );
                        }}
                    >

                    </List>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: "row", height: 40, marginTop: 30 }}>
                        <Button style={{
                            borderRadius: 20,
                            backgroundColor: "#dedbd5",
                            flex: 1,
                            marginHorizontal: 30,
                            height: 35,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            <Text style={{ fontSize: 12, color: 'black' }}>Xem tất cả</Text>

                        </Button>
                    </View>
                </View>

            </View>
        );

    }
}

class FindFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            keyword: ''
        }
    }
    addFriend = (uid) => {
        const self = this;
        const data = {
            uid: uid
        }
        fetch(host + '/contact/add-new', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then((res) => {
                if (res.ok) {

                }

            }

            )
    }

    fetchUserData = () => {
        const self = this;
        console.log("11111");
        fetch(host + "/contact/find-users/" + this.state.keyword, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {

                // Read the response as json.
                return response.json();
            })
            .then(function (responseAsJson) {
                self.setState({ users: responseAsJson.users });
                console.log("xsasd");
                console.log(self.state.users);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        const { users } = this.state;

        return (
            <View>

                <InputGroup noBorder style={{ marginHorizontal: 25, marginTop: 20, backgroundColor: '#e3e1e1', borderRadius: 20, height: 40, paddingLeft: 20 }}>
                    <Icon name="md-search" size={20}></Icon>
                    <Input
                        placeholder="Nhập tên hoặc email"
                        onChangeText={(text) => {
                            this.setState({ keyword: text })
                        }}
                        onBlur={() => {
                            this.fetchUserData();
                        }}
                    >
                    </Input>
                </InputGroup>

                <View>

                    <List

                        dataArray={users}
                        renderItem={({ item, index }) => {
                            return (
                                <Card transparent style={{ height: 85 }}>
                                    <CardItem>



                                        <Thumbnail source={{ uri: linkImage + item.avatar }}></Thumbnail>
                                        <Body style={{ marginLeft: 20 }}>
                                            <Text style={{ fontWeight: "bold" }}>{item.username}</Text>
                                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                                <Button primary style={{ marginRight: 10, borderRadius: 8 }}
                                                    onPress={() => {
                                                        this.addFriend(item._id);
                                                    }}
                                                >
                                                    <Text>Thêm bạn</Text>
                                                </Button>

                                            </View>



                                        </Body>





                                    </CardItem>
                                </Card>

                            );
                        }}
                    >

                    </List>
                </View>

            </View>
        );
    }
}

export default class FriendComponent extends Component {

    render() {

        return (
            <Container>
                <Header style={{ backgroundColor: 'white', height: 80 }} >
                    <Left>
                        <Button transparent >
                            <Thumbnail small source={{ uri: "https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/82824068_832056623905097_6562117601974026240_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=wW7C0l1q4_wAX9-2D_m&_nc_ht=scontent.fhph1-1.fna&oh=7eeba18c823fa2852f0927904ba7b9bf&oe=5F5B3D1A" }}></Thumbnail>
                        </Button>

                    </Left>
                    <Body>
                        <H2 style={{ fontWeight: 'bold' }}>Bạn bè</H2>
                    </Body>

                    <Right>
                        <Button transparent>
                            <Badge style={{ backgroundColor: '#e3e1e1', height: 28, width: 28 }}>
                                <Icon name='md-create' type="ionicon"
                                    size={20}
                                    color="black"
                                ></Icon>
                            </Badge>

                        </Button>
                        <Button transparent>
                            <Badge style={{ backgroundColor: '#e3e1e1', height: 30, width: 30 }}>
                                <Icon name='md-camera' type="ionicon"
                                    size={20}
                                    color="black"
                                ></Icon>
                            </Badge>

                        </Button>


                    </Right>
                </Header>
                <Content>
                    <Tabs tabStyle={{ backgroundColor: 'white' }}>
                        <Tab heading="Bạn bè" tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: 'blue', fontWeight: 'bold' }} >
                            <ListFriend navigation={this.props.navigation} />
                        </Tab>
                        <Tab heading="Lời mời kết bạn" tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: 'blue', fontWeight: 'bold' }}>
                            <AddFriend />
                        </Tab>
                        <Tab heading="Tìm bạn" tabStyle={{ backgroundColor: 'white' }} textStyle={{ color: 'black' }} activeTabStyle={{ backgroundColor: 'white' }} activeTextStyle={{ color: 'blue', fontWeight: 'bold' }}>
                            <FindFriend />
                        </Tab>


                    </Tabs>


                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        padding: 20
    },
    title: {
        margin: 20,
        fontSize: 20,
        fontWeight: 'bold'
    },


})