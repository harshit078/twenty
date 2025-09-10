import { currentUserState } from '@/auth/states/currentUserState';
import { impersonationTokenPairState } from '@/auth/states/impersonationTokenPairState';
import { getUserName } from '@/impersonation-banner/utils/getUserName';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'twenty-shared/utils';
import { cookieStorage } from '~/utils/cookie-storage';
import { ImpersonationBanner } from './ImpersonationBanner';
import { IMPERSONATION_BANNER_HEIGHT } from '@/impersonation-banner/constants/ImpersonationBannerHeight';

const StyledImpersonationBannerWrapper = styled.div`
  height: ${IMPERSONATION_BANNER_HEIGHT};
  position: relative;

  &:empty {
    height: 0;
  }
`;

export const ImpersonationBannerWrapper = () => {
  const impersonationTokenPair = useRecoilValue(impersonationTokenPairState);
  const hasCookie = isDefined(cookieStorage.getItem('impersonationTokenPair'));
  const isImpersonating = isDefined(impersonationTokenPair) || hasCookie;

  const currentUser = useRecoilValue(currentUserState);

  const displayName = getUserName(currentUser);
  const bannerText = `You are impersonating ${displayName}`;

  const handleStopImpersonating = () => {
    cookieStorage.removeItem('impersonationTokenPair');
    window.location.reload();
  };
  const buttonOnClick = isImpersonating ? handleStopImpersonating : undefined;

  if (!isImpersonating) {
    return <StyledImpersonationBannerWrapper />;
  }

  return (
    <StyledImpersonationBannerWrapper>
      <ImpersonationBanner message={bannerText} buttonOnClick={buttonOnClick} />
    </StyledImpersonationBannerWrapper>
  );
};
