/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import OmnichannelChatSDK from '@microsoft/omnichannel-chat-sdk';
import { DeliveryMode, MessageContentType, MessageType, PersonType } from '@microsoft/omnichannel-chat-sdk';
import createVoiceVideoCalling, {LocalVideoView, RemoteVideoView} from '@microsoft/omnichannel-voice-video-calling-react-native';

const omnichannelConfig = {
    orgUrl: "https://unq9fcc36a6f713ee11a66b6045bd016-crm.omnichannelengagementhub.com",
    orgId: "9fcc36a6-f713-ee11-a66b-6045bd016601",
    widgetId: "3d3beebc-1912-4afe-a578-cef34d6f4cc5"
};

const chatSDK = new OmnichannelChatSDK.OmnichannelChatSDK(omnichannelConfig);
const voiceVideoCallingSDK = createVoiceVideoCalling(omnichannelConfig, { disable: true });

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [display, setDisplay] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const initChatSDK = async () => {
    const optionalParams = {
      getLiveChatConfigOptionalParams: {
        sendCacheHeaders: false // Whether to send Cache-Control HTTP header to GetChatConfig call
      }
    };

    const chatSDKConfig = { // Optional
      dataMasking: {
          disable: false,
          maskingCharacter: '#'
      }
  };

    await chatSDK.initialize(optionalParams, chatSDKConfig);
    console.log('chatSDK initialized');
  }

  useEffect(() => {
    initChatSDK();
  }, []);

  const startChat = async () => {
    console.log('startChat');

    const customContext = {
      'contextKey1': { 'value': 'contextValue1', 'isDisplayable': true },
      'contextKey2': { 'value': 12.34, 'isDisplayable': false },
      'contextKey3': { 'value': true }
    };

    const optionalParams2 = {
      preChatResponse: '', // PreChatSurvey response
      // liveChatContext: {}, // EXISTING chat context data
      customContext, // Custom Context
      sendDefaultInitContext: false // Send default init context ⚠️ Web only
    };

    await chatSDK.startChat(optionalParams2);
    // await chatSDK.startChat();

    const callingToken = await chatSDK.getCallingToken();
    console.log(callingToken);
    await chatSDK.onAgentEndSession(async () => {
      console.log(`ExampleApp/onAgentEndSession`);
      await chatSDK?.endChat();
    });

    // Get chat token
    console.log(`ExampleApp/startChat/getChatToken`);
    const chatToken = await chatSDK?.getChatToken();

    // Ask permissions for android
    voiceVideoCallingSDK.askPermissions();

    // Initialize VoiceVideoCallingSDK
    voiceVideoCallingSDK.initialize({
      chatToken,
      callingToken,
      OCClient: chatSDK.OCClient,
    });
    // voiceVideoCallingSDK.initialize();

    // Triggered when there's an incoming call
    voiceVideoCallingSDK.onCallAdded(() => {
      console.log('onCallAdded');
    });

    // Triggered when local video stream is available (e.g.: Local video stream added succesfully in LocalVideoView)
    voiceVideoCallingSDK.onLocalVideoStreamAdded(() => {
      console.log('onLocalVideoStreamAdded');
    });

    // Triggered when local video stream is unavailable (e.g.: Local video stream removed from LocalVideoView)
    voiceVideoCallingSDK.onLocalVideoStreamRemoved(() => {
      console.log('onLocalVideoStreamRemoved');
    });

    // Triggered when remote video stream is available (e.g.: Remote video stream added succesfully in RemoteVideoView)
    voiceVideoCallingSDK.onRemoteVideoStreamAdded(() => {
      console.log('onRemoteVideoStreamAdded');
    });

    // Triggered when remote video stream is unavailable (e.g.: Remote video stream removed from RemoteVideoView)
    voiceVideoCallingSDK.onRemoteVideoStreamRemoved(() => {
      console.log('onRemoteVideoStreamRemoved');
    });

    // Triggered when current call has ended or disconnected regardless the party
    voiceVideoCallingSDK.onCallDisconnected(() => {
      console.log('onCallDisconnected');
    });
  }

  const endChat = async () => {
    console.log('endChat');
    await chatSDK.endChat();
  }

  const sendMessage = async () => {
    console.log('sendMessage');

    const displayName = "Contoso"
    const message = "Sample message from customer";
    const messageToSend = {
        content: message
    };

    await chatSDK.sendMessage(messageToSend);
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            onPress={ startChat }
            title="Start Chat"
            color="#841584"
            accessibilityLabel="Start Chat"
          />
          <Button
            onPress={ sendMessage }
            title="Send Message"
            color="#841584"
            accessibilityLabel="Send Message"
          />
          <Button
            onPress={ endChat }
            title="End Chat"
            color="#841584"
            accessibilityLabel="End Chat"
          />
          <View style={display ? styles.videoContainer : styles.noDisplay}>
            <RemoteVideoView style={styles.videoContainer} />
            {/*<LocalVideoView style={ styles.videoContainer } />*/}
          </View>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  videoContainer: {
    height: 100,
    width: 100,
  },
  noDisplay: { // Style to hide the video container view
    display: 'none',
    height: 0,
    width: 0
  }
});

export default App;
