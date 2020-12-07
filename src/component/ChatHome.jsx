
import React from 'react';
import { Chat, Channel, ChannelList, Window } from 'stream-chat-react';
import { ChannelHeader, MessageList } from 'stream-chat-react';
import { MessageInput, Thread } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

import 'stream-chat-react/dist/css/index.css';

const chatClient = new StreamChat('egs5j3askufz');

let user = sessionStorage.getItem('authenticatedUser');

if(user === null || user === '')
{
  const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiQXJqdW4ifQ.H2sKhyXBUvx1-BWJmxeBqUFai3XrO299ekCFE_eJQgo';
  chatClient.setUser(
    {
      id: 'Arjun',
      name: 'Arjun Bhavsar' },
    userToken,
  );
}else{
    if(user.includes('arjun')){
      const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiQXJqdW4ifQ.H2sKhyXBUvx1-BWJmxeBqUFai3XrO299ekCFE_eJQgo';
      chatClient.setUser(
        {
          id: 'Arjun',
          name: 'Arjun Bhavsar' },
        userToken,
      );
    }else if(user.includes('markus')){
      const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiTWFya3VzUCJ9.KtXf8PAQF2ZpBdiX9YMOm8gNWbJrrdU5WljzNcUas9o';
      chatClient.setUser(
        {
          id: 'MarkusP',
          name: 'Markus Peterson' },
        userToken,
      );
    }else if(user.includes('daniel')){
      const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiRGFuaWVsQiJ9.J4xPePqevRdpInhOHdLhBYMpKhTlw5Gr03An4AQCZuk';
      chatClient.setUser(
        {
          id: 'DanielB',
          name: 'Daniel Byun' },
        userToken,
      );
    }else if (user.includes('heather')){
      const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiSGVhdGhlckEifQ.-AX_Fm9VTtkXNLjs8yIs1NajS6m0zE1ZAE8Q5QkljbU';
      chatClient.setUser(
        {
          id: 'HeatherA',
          name: 'Heather Ahmann' },
        userToken,
      );
    }else{
        const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiSGVhdGhlckEifQ.-AX_Fm9VTtkXNLjs8yIs1NajS6m0zE1ZAE8Q5QkljbU';
        chatClient.setUser(
          {
            id: 'HeatherA',
            name: user},
          userToken,
        );
      }
  }
 

const conversation1 = chatClient.channel('messaging', 'Quick-Pick', {
  name: 'Quick-Pick',
  image: 'http://bit.ly/2O35mws',
  members:['Arjun', 'MarkusP', 'DanielB','HeatherA'],
});
conversation1.create();

const conversation3 = chatClient.channel('messaging', 'project', {
  name: 'Quick-Pick',
  image: 'http://bit.ly/2O35mws',
  members:['Arjun', 'MarkusP', 'DanielB','HeatherA'],
});
conversation3.create();

const conversation2 = chatClient.channel('messaging', 'Software-Engineering', {
  name: 'Software Engineering',
  members:['Arjun', 'MarkusP', 'DanielB','HeatherA'],
});
conversation2.create();


const filters = { type: 'messaging', members: { $in: ['Arjun'] } };
const sort = { last_message_at: -1 };
const channels = chatClient.queryChannels(filters, sort);

const response = chatClient.queryUsers({ id: { $in: ['Arjun', 'MarkusP', 'DanielB','HeatherA'] } });

//const response = await serverClient.queryUsers({ name: { $autocomplete: 'ro' } });

const ChatHome = () => (
  <div style={{height: 'calc(100% - 72px)'}}>
    <Chat client={chatClient} theme={'messaging light'} style={{height: 'calc(100% - 72px)'}}>
      <ChannelList 
        filters={filters}
        sort={sort}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  </div>
);

export default ChatHome; 


