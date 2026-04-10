import { UsersService } from '../../users/users.service';
import { ToolDefinition } from '../types';

export function buildUserTools(usersService: UsersService): ToolDefinition[] {
  return [
    {
      tool: {
        name: 'ricardian_get_profile',
        description:
          "Fetch the authenticated user's profile: id, display_name, email, avatar_url, role, notification_prefs, linked wallet addresses, and timestamps.",
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      handler: async (user) => usersService.getProfile(user.id),
    },
  ];
}
