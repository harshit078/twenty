import { useEmailsField } from '@/object-record/record-field/meta-types/hooks/useEmailsField';
import { EmailsFieldMenuItem } from '@/object-record/record-field/meta-types/input/components/EmailsFieldMenuItem';
import { recordFieldInputIsFieldInErrorComponentState } from '@/object-record/record-field/states/recordFieldInputIsFieldInErrorComponentState';
import { emailSchema } from '@/object-record/record-field/validation-schemas/emailSchema';
import { useSetRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentStateV2';
import { useCallback, useMemo } from 'react';
import { isDefined } from 'twenty-shared';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { MultiItemFieldInput } from './MultiItemFieldInput';

type EmailsFieldInputProps = {
  onCancel?: () => void;
  onClickOutside?: (event: MouseEvent | TouchEvent) => void;
};

export const EmailsFieldInput = ({
  onCancel,
  onClickOutside,
}: EmailsFieldInputProps) => {
  const { persistEmailsField, hotkeyScope, fieldValue } = useEmailsField();

  const emails = useMemo<string[]>(
    () =>
      [
        fieldValue?.primaryEmail ? fieldValue?.primaryEmail : null,
        ...(fieldValue?.additionalEmails ?? []),
      ].filter(isDefined),
    [fieldValue?.primaryEmail, fieldValue?.additionalEmails],
  );

  const handlePersistEmails = (updatedEmails: string[]) => {
    const [nextPrimaryEmail, ...nextAdditionalEmails] = updatedEmails;
    persistEmailsField({
      primaryEmail: nextPrimaryEmail ?? '',
      additionalEmails: nextAdditionalEmails,
    });
  };

  const validateInput = useCallback(
    (input: string) => ({
      isValid: emailSchema.safeParse(input).success,
      errorMessage: '',
    }),
    [],
  );

  const isPrimaryEmail = (index: number) => index === 0 && emails?.length > 1;

  const setIsFieldInError = useSetRecoilComponentStateV2(
    recordFieldInputIsFieldInErrorComponentState,
  );

  const handleError = (hasError: boolean, values: any[]) => {
    setIsFieldInError(hasError && values.length === 0);
  };

  return (
    <MultiItemFieldInput
      items={emails}
      onPersist={handlePersistEmails}
      onCancel={onCancel}
      onClickOutside={onClickOutside}
      placeholder="Email"
      fieldMetadataType={FieldMetadataType.EMAILS}
      validateInput={validateInput}
      renderItem={({
        value: email,
        index,
        handleEdit,
        handleSetPrimary,
        handleDelete,
      }) => (
        <EmailsFieldMenuItem
          key={index}
          dropdownId={`${hotkeyScope}-emails-${index}`}
          isPrimary={isPrimaryEmail(index)}
          email={email}
          onEdit={handleEdit}
          onSetAsPrimary={handleSetPrimary}
          onDelete={handleDelete}
        />
      )}
      onError={handleError}
      hotkeyScope={hotkeyScope}
    />
  );
};
