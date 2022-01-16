import * as t from 'io-ts';
import { isRight } from 'fp-ts/Either';
import { optional } from 'io-ts-extra';
import { PathReporter } from 'io-ts/PathReporter';

function printValidator(context: string, validator: t.Validation<unknown>) {
  console.log('>>>> context', context);
  if (isRight(validator)) {
    console.log('Correct', JSON.stringify(validator.right));
  } else {
    console.log('Wrong value', JSON.stringify(PathReporter.report(validator)));
  }
}

type TypeUser = {
  name: string;
  age: number;
  gender: 'male' | 'female';
};

const User = t.type({
  name: t.string,
  age: t.number,
  gender: t.keyof({
    male: t.literal('male'),
    female: t.literal('female'),
  }),
});

printValidator(
  'No error',
  User.decode({
    name: 'test',
    age: 12,
    gender: 'male',
  })
);

// name is null
printValidator(
  'Invalid name',
  User.decode({
    name: null as unknown as string,
    age: 12,
    gender: 'male',
  })
);

// age is not a number
printValidator(
  'Invalid age',
  User.decode({
    name: 'tet',
    age: null as unknown as number,
    gender: 'male',
  })
);

// test optional type

const OptionalValidator = t.type({
  name: optional(t.string),
});

printValidator(
  'Optional has value',
  OptionalValidator.decode({
    name: 'test',
  })
);

printValidator(
  'Optional null',
  OptionalValidator.decode({
    name: null,
  })
);
