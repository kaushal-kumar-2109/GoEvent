export const getAvatarPath = (avatarVal) => {
  if (typeof avatarVal === 'string' && (avatarVal.startsWith('/') || avatarVal.startsWith('http'))) {
    return avatarVal;
  }
  
  const index = typeof avatarVal === 'number' ? avatarVal : parseInt(avatarVal);
  if (isNaN(index)) {
    return '/avatar/user1.jpg'; // Default fallback avatar
  }

  // Map index safely in range [1, 16]
  const avatarNum = (Math.abs(index) % 16) + 1;
  const extension = avatarNum >= 13 ? 'png' : 'jpg';
  return `/avatar/user${avatarNum}.${extension}`;
};
