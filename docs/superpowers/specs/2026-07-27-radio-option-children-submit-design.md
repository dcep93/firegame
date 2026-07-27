# Radio Option Child Workflow and Submit Behavior

## Goal

Execute queued or immediate indexed radio options according to the workflow
rendered by the selected option:

- stop after selecting an option that opens a nested interaction; or
- submit a leaf option using its actual enabled submit button, regardless of
  the button label.

This removes the incorrect assumption that every indexed radio option must be
followed by a button labeled `Confirm`.

## Verified Live Structure

The AstroDrill action in the current Terraforming Mars UI demonstrates both
cases.

### Leaf options

Options 1 and 3 render an empty nested
`.wf-component--select-option` after selection. They do not require another
choice. Their final submit buttons are:

- option 1: `Remove asteroid`;
- option 3: `Gain`.

### Branching option

Option 2 renders an interactive `.wf-component--select-card` containing card
inputs. The action form also displays an enabled `Add asteroid` button, but the
radio-option executor must not click it because card targeting is a separate
child interaction.

The presence or label of a submit button therefore cannot determine whether
the selected radio option is complete.

## Execution Flow

For a `radioOption` queue item:

1. Select the requested one-based radio index using the existing validation
   and click behavior.
2. Wait one animation frame for the selected option's workflow to render.
3. Locate the option container belonging to the selected radio.
4. Inspect the nested workflow mounted beneath that option.
5. If the nested workflow contains a real follow-up interaction, return
   successfully without clicking a submit button.
6. If the nested workflow is an empty leaf marker, find the enabled submit
   button for the current action form and click it.

This behavior applies equally to an item executed directly from an Enqueue
click and an item executed from the persisted queue because both paths share
`executeQueuedItem`.

## Child Workflow Detection

A selected option has children when its nested workflow is meaningfully
interactive. Evidence includes:

- card choices;
- enabled or disabled form inputs other than the selected parent radio;
- selects or textareas; or
- another nonempty workflow component.

An empty `.wf-component--select-option` with no interactive descendants is a
leaf marker, not a child workflow.

Detection is scoped to the selected radio's option container. It must not use
unrelated controls elsewhere in the action form.

## Leaf Submit Selection

For a leaf option:

- collect enabled `.btn-submit` buttons within the current action form;
- click the button when exactly one exists;
- do not require or prefer any button text; and
- preserve scroll position through the existing helper.

Expected labels include, but are not limited to:

- `Remove asteroid`;
- `Gain`; and
- `Confirm`.

Button text is diagnostic only and is not part of the execution contract.

## Errors

The executor continues to reject:

- an invalid radio index;
- a missing radio option;
- a disabled radio option;
- a missing action form;
- a leaf option with no enabled submit button; and
- a leaf option with multiple enabled submit buttons.

Selecting a branching option is successful once its child workflow appears.
The radio item is not restored or reported as failed merely because the child
workflow's submit button belongs to a later queued action.

## Scope

This change does not alter:

- queue ordering;
- immediate-versus-persisted enqueue decisions;
- card-target execution;
- project-card or played-action execution;
- Autoqueue behavior;
- turn scrolling;
- Pass behavior; or
- radio index validation.

## Verification

Tests will cover:

- a leaf option whose unique submit text is `Remove asteroid`;
- a leaf option whose unique submit text is `Gain`;
- a leaf option whose unique submit text is `Confirm`;
- a branching card-selection option that does not click `Add asteroid`;
- child detection scoped to the selected option container;
- missing and ambiguous enabled leaf submit buttons;
- existing disabled and out-of-range radio validation; and
- the complete extension test suite.
