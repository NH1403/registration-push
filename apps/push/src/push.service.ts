import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PushUserDto } from './dto/push-user.dto';

@Injectable()
export class PushService {
  async send(user: PushUserDto) {
    try {
      const response = await axios.post(
        'https://webhook.site/74409f64-d7cd-4808-ac59-2a4ee7c1da83', // push service URL mock
        {
          id: user.id,
          message: `Hi ${user.name}, Here is a super engaging push that will bring you back to the app`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        console.log(`Sent push to push service for user ${user.id}`);
      } else {
        console.error(
          `Error sending push to push service for user ${user.id}. Response status: ${response.status}. Response data: ${response.data}`,
        );
      }
    } catch (error) {
      console.error(`Error sending push to the user ${user.id}`, error);
      throw error;
    }
  }
}
