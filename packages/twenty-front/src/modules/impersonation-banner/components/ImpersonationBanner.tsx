import styled from '@emotion/styled';
import {
    Banner,
    IconX,
    type BannerVariant,
} from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { cookieStorage } from '~/utils/cookie-storage';

const StyledText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ImpersonationBanner = ({
  message,
  variant = 'default',
  buttonOnClick,
}: {
  message: string;
  variant?: BannerVariant;
  buttonOnClick?: () => void;
}) => {

  return (
    <Banner variant={variant}>
      <StyledText>{message}</StyledText>
      <Button
        variant="secondary"
        title="Stop impersonating"
        Icon={IconX}
        size="small"
        onClick={buttonOnClick}
        inverted
      />
    </Banner>
  );
};
